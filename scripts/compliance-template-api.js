const http = require('http');
const { randomUUID } = require('crypto');
const { URL } = require('url');
const { Client } = require('pg');

const DEFAULT_DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/ecommerce_aggregation';
const PORT = Number(process.env.COMPLIANCE_TEMPLATE_API_PORT || process.env.PORT || 8787);
const HOST = process.env.COMPLIANCE_TEMPLATE_API_HOST || '127.0.0.1';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

const ALLOWED_ORIGINS = new Set([
  'https://agentseller.temu.com',
  'https://agentseller-us.temu.com',
  'https://agentseller-eu.temu.com',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]);

function nowIso() {
  return new Date().toISOString();
}

function normalizeRecord(input) {
  const record = input && typeof input === 'object' ? input : {};
  const product = record.product && typeof record.product === 'object' ? record.product : {};
  const ownership = record.ownership && typeof record.ownership === 'object' ? record.ownership : {};

  return {
    name: String(record.name || '').trim(),
    companyId: String(record.companyId || ownership.companyId || 'unknown-company').trim() || 'unknown-company',
    shopId: String(record.shopId || ownership.shopId || 'unknown-shop').trim() || 'unknown-shop',
    platform: String(record.platform || ownership.platform || 'TEMU').trim() || 'TEMU',
    siteKey: String(record.siteKey || ownership.siteKey || 'agentseller.temu.com').trim() || 'agentseller.temu.com',
    spuId: nullableString(record.spuId || product.spuId),
    productTitle: nullableString(record.productTitle || product.productTitle || product.title),
    category: nullableString(record.category || product.category),
    sourceUrl: nullableString(record.sourceUrl || record.url),
    shopName: nullableString(record.shopName || ownership.shopName),
    templateInfoJson: record.templateInfoJson || record.template || {},
  };
}

function nullableString(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function sendJson(res, statusCode, payload, origin) {
  const body = JSON.stringify(payload);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  };
  applyCorsHeaders(headers, origin);
  res.writeHead(statusCode, headers);
  res.end(body);
}

function sendEmpty(res, statusCode, origin) {
  const headers = {};
  applyCorsHeaders(headers, origin);
  res.writeHead(statusCode, headers);
  res.end();
}

function applyCorsHeaders(headers, origin) {
  if (!origin || ALLOWED_ORIGINS.has(origin) || origin.startsWith('chrome-extension://')) {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  }
  headers['Access-Control-Allow-Methods'] = 'GET,POST,DELETE,OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type';
  headers['Access-Control-Max-Age'] = '86400';
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function withClient(fn) {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    companyId: row.companyId,
    shopId: row.shopId,
    platform: row.platform,
    siteKey: row.siteKey,
    spuId: row.spuId,
    productTitle: row.productTitle,
    category: row.category,
    sourceUrl: row.sourceUrl,
    templateInfoJson: row.templateInfoJson,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function findByName(client, record) {
  const result = await client.query(
    `SELECT * FROM "ComplianceInfoTemplate"
     WHERE "companyId" = $1 AND "shopId" = $2 AND "name" = $3
     LIMIT 1`,
    [record.companyId, record.shopId, record.name],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function insertRecord(client, record) {
  const id = randomUUID();
  const result = await client.query(
    `INSERT INTO "ComplianceInfoTemplate"
      ("id", "name", "companyId", "shopId", "platform", "siteKey", "spuId", "productTitle", "category", "sourceUrl", "templateInfoJson", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [
      id,
      record.name,
      record.companyId,
      record.shopId,
      record.platform,
      record.siteKey,
      record.spuId,
      record.productTitle,
      record.category,
      record.sourceUrl,
      JSON.stringify(record.templateInfoJson),
    ],
  );
  return mapRow(result.rows[0]);
}

async function resolveRecordOwnership(client, record) {
  if (isInternalId(record.companyId) && isInternalId(record.shopId)) return record;
  if (!record.shopName && !record.shopId) return record;

  const result = await findShopForOwnership(client, {
    platform: record.platform,
    shopName: record.shopName,
    shopId: record.shopId,
  });
  const row = result.rows[0];
  if (!row) return record;

  const resolvedOwnership = {
    ...(record.templateInfoJson.ownership || {}),
    companyId: row.companyId,
    shopId: row.id,
    platform: row.platform,
    platformShopId: row.platformShopId,
    shopName: row.shopName,
  };

  return {
    ...record,
    companyId: row.companyId,
    shopId: row.id,
    platform: row.platform,
    templateInfoJson: {
      ...record.templateInfoJson,
      ownership: resolvedOwnership,
    },
  };
}

function isInternalId(value) {
  return /^c[a-z0-9]{20,}$/i.test(String(value || '').trim());
}

function isExternalShopId(value) {
  return /^[0-9]{8,}$/.test(String(value || '').trim());
}

function buildShopLookupWhere(shopName, shopId) {
  const conditions = [];
  const params = [];
  let shopNameIndex = 0;
  let shopIdIndex = 0;

  if (shopName) {
    params.push(shopName);
    shopNameIndex = params.length + 1;
    conditions.push(`lower("shopName") = lower($${shopNameIndex})`);
    conditions.push(`lower("shopName") = lower($${shopNameIndex} || ' local')`);
    conditions.push(`lower("platformShopId") = lower($${shopNameIndex})`);
  }

  if (shopId) {
    params.push(shopId);
    shopIdIndex = params.length + 1;
    conditions.push(`"id" = $${shopIdIndex}`);
    conditions.push(`"platformShopId" = $${shopIdIndex}`);
  }

  return { conditions, params, shopNameIndex, shopIdIndex };
}

async function findShopForOwnership(client, { platform, shopName, shopId }) {
  const lookup = buildShopLookupWhere(shopName, shopId);
  if (!lookup.conditions.length) return { rows: [] };

  const orderBy = lookup.shopIdIndex && isInternalId(shopId)
    ? `CASE WHEN "id" = $${lookup.shopIdIndex} THEN 0 ELSE 1 END`
    : lookup.shopIdIndex && isExternalShopId(shopId)
      ? `CASE WHEN "platformShopId" = $${lookup.shopIdIndex} THEN 0 ELSE 1 END`
      : lookup.shopNameIndex
        ? `CASE WHEN lower("shopName") = lower($${lookup.shopNameIndex}) THEN 0 ELSE 1 END`
        : `"updatedAt" DESC`;

  return client.query(
    `SELECT "id", "companyId", "platformShopId", "shopName", "platform"
     FROM "Shop"
     WHERE "platform"::text = $1
       AND (${lookup.conditions.join(' OR ')})
     ORDER BY ${orderBy}, "updatedAt" DESC
     LIMIT 1`,
    [platform, ...lookup.params],
  );
}

async function handleCreate(req, res, origin) {
  const body = await readBody(req);
  let record = normalizeRecord(body);

  if (!record.name) {
    sendJson(res, 400, { error: '模板名称不能为空' }, origin);
    return;
  }

  await withClient(async (client) => {
    record = await resolveRecordOwnership(client, record);
    const existing = await findByName(client, record);
    if (existing) {
      sendJson(res, 409, { error: '模板名称已存在', existing }, origin);
      return;
    }

    const saved = await insertRecord(client, record);
    sendJson(res, 201, { data: saved }, origin);
  });
}

async function handleReplace(req, res, origin) {
  const body = await readBody(req);
  let record = normalizeRecord(body);

  if (!record.name) {
    sendJson(res, 400, { error: '模板名称不能为空' }, origin);
    return;
  }

  await withClient(async (client) => {
    record = await resolveRecordOwnership(client, record);
    await client.query('BEGIN');
    try {
      await client.query(
        `DELETE FROM "ComplianceInfoTemplate"
         WHERE "companyId" = $1 AND "shopId" = $2 AND "name" = $3`,
        [record.companyId, record.shopId, record.name],
      );
      const saved = await insertRecord(client, record);
      await client.query('COMMIT');
      sendJson(res, 200, { data: saved }, origin);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  });
}

async function handleList(req, res, origin, url) {
  const companyId = url.searchParams.get('companyId') || 'unknown-company';
  const shopId = url.searchParams.get('shopId') || 'unknown-shop';
  const siteKey = url.searchParams.get('siteKey');

  await withClient(async (client) => {
    const params = [companyId, shopId];
    let siteFilter = '';
    if (siteKey) {
      params.push(siteKey);
      siteFilter = ` AND "siteKey" = $3`;
    }

    const result = await client.query(
      `SELECT * FROM "ComplianceInfoTemplate"
       WHERE "companyId" = $1 AND "shopId" = $2${siteFilter}
       ORDER BY "updatedAt" DESC, "createdAt" DESC`,
      params,
    );
    sendJson(res, 200, { data: result.rows.map(mapRow) }, origin);
  });
}

async function handleResolveOwnership(res, origin, url) {
  const shopName = String(url.searchParams.get('shopName') || '').trim();
  const shopId = String(url.searchParams.get('shopId') || '').trim();
  const platform = String(url.searchParams.get('platform') || 'TEMU').trim() || 'TEMU';

  if (!shopName && !shopId) {
    sendJson(res, 400, { error: 'shopName or shopId is required' }, origin);
    return;
  }

  await withClient(async (client) => {
    const result = await findShopForOwnership(client, { platform, shopName, shopId });

    const row = result.rows[0];
    if (!row) {
      sendJson(res, 404, { error: 'Shop ownership not found' }, origin);
      return;
    }

    sendJson(res, 200, {
      data: {
        companyId: row.companyId,
        shopId: row.id,
        platform: row.platform,
        platformShopId: row.platformShopId,
        shopName: row.shopName,
      },
    }, origin);
  });
}

async function handleDelete(res, origin, id) {
  if (!id) {
    sendJson(res, 400, { error: '缺少模板 ID' }, origin);
    return;
  }

  await withClient(async (client) => {
    const result = await client.query(
      `DELETE FROM "ComplianceInfoTemplate" WHERE "id" = $1 RETURNING "id"`,
      [id],
    );
    if (!result.rowCount) {
      sendJson(res, 404, { error: '模板不存在' }, origin);
      return;
    }
    sendJson(res, 200, { data: { id } }, origin);
  });
}

async function route(req, res) {
  const origin = req.headers.origin;
  if (req.method === 'OPTIONS') {
    sendEmpty(res, 204, origin);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      sendJson(res, 200, { ok: true, service: 'compliance-template-api', time: nowIso() }, origin);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/compliance-info-templates') {
      await handleList(req, res, origin, url);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/compliance-info-templates/ownership') {
      await handleResolveOwnership(res, origin, url);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/compliance-info-templates') {
      await handleCreate(req, res, origin);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/compliance-info-templates/replace') {
      await handleReplace(req, res, origin);
      return;
    }

    const deleteMatch = url.pathname.match(/^\/api\/compliance-info-templates\/([^/]+)$/);
    if (req.method === 'DELETE' && deleteMatch) {
      await handleDelete(res, origin, decodeURIComponent(deleteMatch[1]));
      return;
    }

    sendJson(res, 404, { error: 'Not found' }, origin);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: error.message || 'Internal server error' }, origin);
  }
}

const server = http.createServer(route);

server.listen(PORT, HOST, () => {
  console.log(`Compliance template API listening on http://${HOST}:${PORT}`);
});
