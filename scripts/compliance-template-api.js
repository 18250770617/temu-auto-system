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

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

function normalizeTemuHost(siteKey) {
  const text = String(siteKey || '').trim();
  return text || 'agentseller.temu.com';
}

function originFromCookieRecord(cookieRecord, fallbackSiteKey) {
  const sourceOrigin = String(cookieRecord?.sourceOrigin || '').trim();
  if (/^https?:\/\//i.test(sourceOrigin)) return sourceOrigin.replace(/\/+$/, '');
  return `https://${normalizeTemuHost(fallbackSiteKey)}`;
}

function extractCookieValue(cookieHeader, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(cookieHeader || '').match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function apiError(message, statusCode = 400, extra) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (extra) error.extra = extra;
  return error;
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

async function findTemplateById(client, id) {
  const result = await client.query(
    `SELECT * FROM "ComplianceInfoTemplate" WHERE "id" = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function findByName(client, record) {
  const result = await client.query(
    `SELECT * FROM "ComplianceInfoTemplate"
     WHERE "companyId" = $1 AND "name" = $2
     ORDER BY "updatedAt" DESC, "createdAt" DESC
     LIMIT 1`,
    [record.companyId, record.name],
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
         WHERE "companyId" = $1 AND "name" = $2`,
        [record.companyId, record.name],
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
  const siteKey = url.searchParams.get('siteKey');
  const search = String(url.searchParams.get('search') || '').trim();
  const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(50, Math.max(1, Number.parseInt(url.searchParams.get('pageSize') || '10', 10) || 10));
  const offset = (page - 1) * pageSize;

  await withClient(async (client) => {
    const params = [companyId];
    const filters = [`"companyId" = $1`];
    if (siteKey) {
      params.push(siteKey);
      filters.push(`"siteKey" = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const searchParam = `$${params.length}`;
      filters.push(`(
        "name" ILIKE ${searchParam}
        OR COALESCE("spuId", '') ILIKE ${searchParam}
        OR COALESCE("productTitle", '') ILIKE ${searchParam}
        OR COALESCE("category", '') ILIKE ${searchParam}
      )`);
    }

    const where = filters.join(' AND ');
    const totalResult = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM "ComplianceInfoTemplate"
       WHERE ${where}`,
      params,
    );

    const listParams = [...params, pageSize, offset];
    const pageSizeParam = `$${listParams.length - 1}`;
    const offsetParam = `$${listParams.length}`;
    const result = await client.query(
      `SELECT * FROM "ComplianceInfoTemplate"
       WHERE ${where}
       ORDER BY "updatedAt" DESC, "createdAt" DESC
       LIMIT ${pageSizeParam} OFFSET ${offsetParam}`,
      listParams,
    );

    const total = totalResult.rows[0]?.total || 0;
    sendJson(res, 200, {
      data: result.rows.map(mapRow),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    }, origin);
  });
}

function templateUsability(template) {
  const info = template?.templateInfoJson || {};
  const draft = info.submissionDraft || {};
  const missing = [];
  if (!info.ownership) missing.push('ownership');
  if (!info.product) missing.push('product');
  if (!Array.isArray(info.sections)) missing.push('sections');
  if (!info.interfaceSnapshot?.queryDetailCaptured) missing.push('interfaceSnapshot.queryDetailCaptured');
  if (!info.submissionDraft?.template_edit_request_list?.length) missing.push('submissionDraft.template_edit_request_list');
  if (draft.readyForDirectSubmit === false && Array.isArray(draft.missing) && draft.missing.length) {
    missing.push(...draft.missing.map((item) => `submissionDraft.${item}`));
  }

  return {
    applicable: missing.length === 0,
    missing: Array.from(new Set(missing)),
  };
}

function scoreTemplateMatch(row, criteria) {
  const info = row.templateInfoJson || {};
  const product = info.product || {};
  const reasons = [];
  let score = 0;

  if (criteria.extCode && normalizeText(row.name).toLowerCase() === criteria.extCode.toLowerCase()) {
    score += 100;
    reasons.push('name matches extCode');
  }
  if (criteria.spuId && String(row.spuId || product.spuId || '') === criteria.spuId) {
    score += 80;
    reasons.push('spuId matches');
  }
  if (criteria.category && normalizeText(row.category || product.category).toLowerCase() === criteria.category.toLowerCase()) {
    score += 30;
    reasons.push('category matches');
  }
  if (criteria.siteKey && row.siteKey === criteria.siteKey) {
    score += 10;
    reasons.push('siteKey matches');
  }

  return { score, reasons };
}

async function handleMatchTemplates(res, origin, url) {
  const companyId = String(url.searchParams.get('companyId') || 'unknown-company').trim();
  const shopId = nullableString(url.searchParams.get('shopId'));
  const siteKey = nullableString(url.searchParams.get('siteKey'));
  const spuId = nullableString(url.searchParams.get('spuId'));
  const extCode = nullableString(url.searchParams.get('extCode'));
  const category = nullableString(url.searchParams.get('category'));

  await withClient(async (client) => {
    const params = [companyId];
    const filters = [`"companyId" = $1`];
    if (shopId) {
      params.push(shopId);
      filters.push(`"shopId" = $${params.length}`);
    }
    if (siteKey) {
      params.push(siteKey);
      filters.push(`"siteKey" = $${params.length}`);
    }

    const result = await client.query(
      `SELECT * FROM "ComplianceInfoTemplate"
       WHERE ${filters.join(' AND ')}
       ORDER BY "updatedAt" DESC, "createdAt" DESC
       LIMIT 100`,
      params,
    );

    const criteria = { spuId, extCode, category, siteKey };
    const data = result.rows
      .map(mapRow)
      .map((row) => {
        const match = scoreTemplateMatch(row, criteria);
        const usability = templateUsability(row);
        return {
          ...row,
          matchScore: match.score,
          matchReasons: match.reasons,
          usability,
        };
      })
      .filter((row) => row.matchScore > 0 || (!spuId && !extCode && !category))
      .sort((a, b) => b.matchScore - a.matchScore || new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 20);

    sendJson(res, 200, { data }, origin);
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

async function findCookieHeaderForTemu(client, { companyId, siteKey, sourceOrigin }) {
  const params = ['TEMU'];
  const conditions = [`"platform"::text = $1`];
  const order = [
    `CASE WHEN "isLatest" = 1 THEN 0 ELSE 1 END`,
    `"updatedAt" DESC`,
    `"lastSyncedAt" DESC NULLS LAST`,
  ];

  const normalizedSiteKey = normalizeTemuHost(siteKey);
  if (normalizedSiteKey) {
    params.push(normalizedSiteKey);
    conditions.push(`("siteKey" = $${params.length} OR "sourceOrigin" = $${params.length + 1})`);
    params.push(sourceOrigin || `https://${normalizedSiteKey}`);
  }

  if (companyId && companyId !== 'unknown-company') {
    params.push(companyId);
    order.unshift(`CASE WHEN "companyId" = $${params.length} THEN 0 ELSE 1 END`);
  }

  const result = await client.query(
    `SELECT "cookieHeader", "mallId", "siteKey", "sourceOrigin", "companyId"
     FROM "PluginCookieHeader"
     WHERE ${conditions.join(' AND ')}
       AND COALESCE("cookieHeader", '') <> ''
     ORDER BY ${order.join(', ')}
     LIMIT 1`,
    params,
  );
  return result.rows[0] || null;
}

function temuHeaders(cookieRecord, origin, refererPath = '/govern/information-supplementation') {
  const mallId = String(cookieRecord.mallId || extractCookieValue(cookieRecord.cookieHeader, 'mallid') || '').trim();
  if (!mallId) throw apiError('PluginCookieHeader 缺少 mallId', 500);
  return {
    mallId,
    headers: {
      'content-type': 'application/json',
      cookie: cookieRecord.cookieHeader,
      mallid: mallId,
      origin,
      referer: `${origin}${refererPath}`,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    },
  };
}

async function requestTemuCompliance(client, { companyId, siteKey, sourceOrigin, endpoint, body }) {
  const cookieRecord = await findCookieHeaderForTemu(client, { companyId, siteKey, sourceOrigin });
  if (!cookieRecord) throw apiError('未找到 PluginCookieHeader cookieHeader', 500);

  const origin = originFromCookieRecord(cookieRecord, siteKey);
  const request = temuHeaders(cookieRecord, origin);
  const response = await fetch(`${origin}${endpoint}`, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw apiError(payload.error_msg || payload.errorMsg || payload.error || `Temu HTTP ${response.status}`, 502, {
      endpoint,
      status: response.status,
      payload,
    });
  }

  return {
    endpoint,
    status: response.status,
    mallId: request.mallId,
    origin,
    payload,
  };
}

function snapshotFromInput(input, fieldName) {
  const snapshot = input?.[fieldName];
  if (!snapshot || typeof snapshot !== 'object') {
    throw apiError(`${fieldName} is required`);
  }
  if (snapshot.responseBody?.result || snapshot.requestBody) return snapshot;
  if (snapshot.result || snapshot.wait_task_list) {
    return {
      requestBody: {
        goods_id: snapshot.goods_id,
        spu_id: snapshot.spu_id,
        wait_task_list: snapshot.wait_task_list || [],
      },
      responseBody: { result: snapshot.result || snapshot },
    };
  }
  throw apiError(`${fieldName} must contain query_detail requestBody/responseBody`);
}

function resultFromSnapshot(snapshot) {
  return snapshot?.responseBody?.result || snapshot?.result || {};
}

function requestFromSnapshot(snapshot) {
  return snapshot?.requestBody || {};
}

function buildTemplateEditRequest(template, waitTask) {
  if (!template || typeof template !== 'object') return null;

  const request = {};
  copyDefined(request, 'task_id', waitTask?.task_id ?? template.task_id);
  copyDefined(request, 'task_type', template.task_type ?? waitTask?.task_type);
  copyDefined(request, 'task_name', waitTask?.task_name ?? template.task_name);
  copyDefined(request, 'is_not_required', waitTask?.is_not_required ?? template.is_not_required);
  copyDefined(request, 'status', waitTask?.status ?? template.status);
  copyDefined(request, 'task_status', template.task_status ?? waitTask?.task_status);
  copyDefined(request, 'template_id', template.template_id);
  if (template.properties) request.properties = cloneJson(template.properties);
  else if (template.template_id) request.properties = {};
  if (template.images) request.images = cloneJson(template.images);
  else if (template.template_id) request.images = {};
  if (template.input_text) request.input_text = cloneJson(template.input_text);
  else if (template.template_id) request.input_text = {};
  if (template.suppl_prop_info_list) request.suppl_prop_info_list = cloneJson(template.suppl_prop_info_list);

  const repDetailList = selectedRepDetailList(template.rep_detail_list);
  if (repDetailList.length) request.rep_detail_list = repDetailList;
  if (template.reject_reason_list) request.reject_reason_list = cloneJson(template.reject_reason_list);
  return request;
}

function selectedRepDetailList(repDetailList) {
  if (!Array.isArray(repDetailList)) return [];
  const selected = repDetailList.filter((rep) => rep?.default_select);
  const source = selected.length ? selected : repDetailList;
  return source.map((rep) => {
    const result = {};
    copyDefined(result, 'rep_type', rep.rep_type);
    copyDefined(result, 'rep_id', rep.rep_id);
    copyDefined(result, 'rep_name', rep.rep_name);
    return result;
  });
}

function copyDefined(target, key, value) {
  if (value !== undefined && value !== null) target[key] = value;
}

function simpleTemplate(template) {
  if (!template?.template_id) return null;
  const result = {};
  copyDefined(result, 'template_id', template.template_id);
  copyDefined(result, 'template_name', template.template_name);
  copyDefined(result, 'task_type', template.task_type);
  copyDefined(result, 'template_dimension_type', template.template_dimension_type);
  copyDefined(result, 'support_multi_group', template.support_multi_group);
  copyDefined(result, 'task_status', template.task_status);
  return result;
}

function buildPreparedChange({ template, targetQueryDetailSnapshot }) {
  const usability = templateUsability(template);
  if (!usability.applicable) {
    throw apiError('模板缺少可直接应用的数据，请重新从编辑抽屉保存一次模板', 422, { missing: usability.missing });
  }

  const templateInfo = template.templateInfoJson;
  const sourceDraft = templateInfo.submissionDraft;
  const sourceByTaskType = new Map(
    (sourceDraft.template_edit_request_list || []).map((item) => [String(item.task_type), item]),
  );
  const targetRequest = requestFromSnapshot(targetQueryDetailSnapshot);
  const targetResult = resultFromSnapshot(targetQueryDetailSnapshot);
  const waitTaskList = targetRequest.wait_task_list || [];
  const waitTaskByType = new Map(waitTaskList.map((task) => [String(task.task_type), task]));
  const targetTemplates = targetResult.template_list || [];

  const templateEditRequestList = targetTemplates
    .map((targetTemplate) => {
      const taskType = String(targetTemplate.task_type);
      const sourceTemplate = sourceByTaskType.get(taskType);
      const base = sourceTemplate || buildTemplateEditRequest(targetTemplate, waitTaskByType.get(taskType));
      if (!base) return null;
      return {
        ...cloneJson(base),
        ...pickTargetTaskFields(targetTemplate, waitTaskByType.get(taskType)),
      };
    })
    .filter(Boolean);

  const displayedTaskTypeList = waitTaskList
    .map((task) => task.task_type)
    .filter((taskType) => taskType !== undefined && taskType !== null);
  const simpleTemplateList = targetTemplates.map(simpleTemplate).filter(Boolean);
  const missing = [];
  if (!targetResult.goods_id && !targetRequest.goods_id) missing.push('goods_id');
  if (!targetResult.spu_id && !targetRequest.spu_id) missing.push('spu_id');
  if (!targetResult.cat_id && !targetResult.leaf_cat_id) missing.push('cat_id');
  if (!templateEditRequestList.length) missing.push('template_edit_request_list');
  if (!displayedTaskTypeList.length) missing.push('displayed_task_type_list');

  const targetByTaskType = new Map(
    targetTemplates.map((item) => [String(item.task_type), buildTemplateEditRequest(item, waitTaskByType.get(String(item.task_type)))]),
  );
  const diffSummary = templateEditRequestList
    .map((next) => {
      const previous = targetByTaskType.get(String(next.task_type));
      return {
        task_type: next.task_type,
        task_id: next.task_id,
        template_id: next.template_id,
        changed: JSON.stringify(previous || null) !== JSON.stringify(next || null),
        source: sourceByTaskType.has(String(next.task_type)) ? 'template' : 'target',
      };
    })
    .filter((item) => item.changed || item.source === 'template');

  const dynamicTemplateRequest = {
    spu_id: targetResult.spu_id ?? targetRequest.spu_id,
    goods_id: targetResult.goods_id ?? targetRequest.goods_id,
    group_sku_by_same_info: targetResult.group_sku_by_same_info ?? sourceDraft.group_sku_by_same_info ?? true,
    template_edit_request_list: templateEditRequestList,
    displayed_task_type_list: displayedTaskTypeList,
  };

  const checkEditRequest = {
    cat_id: targetResult.cat_id ?? targetResult.leaf_cat_id ?? sourceDraft.cat_id,
    spu_id: dynamicTemplateRequest.spu_id,
    goods_id: dynamicTemplateRequest.goods_id,
    group_sku_by_same_info: dynamicTemplateRequest.group_sku_by_same_info,
    simple_template_list: simpleTemplateList.length ? simpleTemplateList : sourceDraft.simple_template_list || [],
    new_template_edit_request_list: templateEditRequestList,
    old_template_edit_request_list: Array.from(targetByTaskType.values()).filter(Boolean),
  };

  return {
    template: {
      id: template.id,
      name: template.name,
      spuId: template.spuId,
      productTitle: template.productTitle,
      category: template.category,
    },
    target: {
      goods_id: dynamicTemplateRequest.goods_id,
      spu_id: dynamicTemplateRequest.spu_id,
      cat_id: checkEditRequest.cat_id,
    },
    missing,
    diffSummary,
    dynamicTemplateRequest,
    checkEditRequest,
    applyRequest: {
      ...checkEditRequest,
      template_edit_request_list: templateEditRequestList,
    },
  };
}

function pickTargetTaskFields(targetTemplate, waitTask) {
  const result = {};
  copyDefined(result, 'task_id', waitTask?.task_id ?? targetTemplate.task_id);
  copyDefined(result, 'task_type', targetTemplate.task_type ?? waitTask?.task_type);
  copyDefined(result, 'task_name', waitTask?.task_name ?? targetTemplate.task_name);
  copyDefined(result, 'is_not_required', waitTask?.is_not_required ?? targetTemplate.is_not_required);
  copyDefined(result, 'status', waitTask?.status ?? targetTemplate.status);
  copyDefined(result, 'task_status', targetTemplate.task_status ?? waitTask?.task_status);
  copyDefined(result, 'template_id', targetTemplate.template_id);
  return result;
}

async function resolveTemplateForWorkflow(client, body) {
  if (body.template && typeof body.template === 'object') {
    return normalizeWorkflowTemplate(body.template);
  }
  const templateId = nullableString(body.templateId);
  if (!templateId) throw apiError('templateId or template is required');
  const template = await findTemplateById(client, templateId);
  if (!template) throw apiError('模板不存在', 404);
  return template;
}

function normalizeWorkflowTemplate(template) {
  return {
    id: template.id || 'inline-template',
    name: template.name || 'inline-template',
    companyId: template.companyId,
    shopId: template.shopId,
    platform: template.platform || 'TEMU',
    siteKey: template.siteKey,
    spuId: template.spuId,
    productTitle: template.productTitle,
    category: template.category,
    sourceUrl: template.sourceUrl,
    templateInfoJson: template.templateInfoJson || template,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

async function handlePrepareChange(req, res, origin) {
  const body = await readBody(req);
  await withClient(async (client) => {
    const template = await resolveTemplateForWorkflow(client, body);
    const targetQueryDetailSnapshot = snapshotFromInput(body, 'targetQueryDetailSnapshot');
    const prepared = buildPreparedChange({ template, targetQueryDetailSnapshot });
    sendJson(res, 200, { data: prepared }, origin);
  });
}

async function handleDryRunChange(req, res, origin) {
  const body = await readBody(req);
  await withClient(async (client) => {
    const template = await resolveTemplateForWorkflow(client, body);
    const targetQueryDetailSnapshot = snapshotFromInput(body, 'targetQueryDetailSnapshot');
    const prepared = body.preparedChange || buildPreparedChange({ template, targetQueryDetailSnapshot });
    if (prepared.missing?.length) throw apiError('缺少生成校验请求所需字段', 422, { missing: prepared.missing });

    const context = {
      companyId: nullableString(body.companyId || template.companyId),
      siteKey: nullableString(body.siteKey || template.siteKey || template.templateInfoJson?.ownership?.siteKey),
      sourceOrigin: nullableString(body.sourceOrigin),
    };
    const dynamic = await requestTemuCompliance(client, {
      ...context,
      endpoint: '/ms/bg-flux-ms/compliance_property/query_dynamic_template',
      body: prepared.dynamicTemplateRequest,
    });
    const dynamicResult = dynamic.payload?.result || {};
    const checkRequest = {
      ...prepared.checkEditRequest,
      simple_template_list: dynamicResult.simple_template_list || prepared.checkEditRequest.simple_template_list,
      new_template_edit_request_list: dynamicResult.new_template_edit_request_list || prepared.checkEditRequest.new_template_edit_request_list,
    };
    const check = await requestTemuCompliance(client, {
      ...context,
      endpoint: '/ms/bg-flux-ms/compliance_property/check_edit_compliance',
      body: checkRequest,
    });

    sendJson(res, 200, {
      data: {
        prepared,
        dynamicTemplate: sanitizeTemuCall(dynamic),
        checkEditCompliance: sanitizeTemuCall(check),
        applyRequest: {
          ...checkRequest,
          template_edit_request_list: check.payload?.result?.new_template_edit_request_list || checkRequest.new_template_edit_request_list,
        },
      },
    }, origin);
  });
}

async function handleApplyChange(req, res, origin) {
  const body = await readBody(req);
  if (body.confirmApply !== true) {
    throw apiError('confirmApply=true is required before calling edit_compliance', 409);
  }
  await withClient(async (client) => {
    const template = await resolveTemplateForWorkflow(client, body);
    const applyRequest = body.applyRequest || body.preparedChange?.applyRequest;
    if (!applyRequest || typeof applyRequest !== 'object') throw apiError('applyRequest is required');
    const response = await requestTemuCompliance(client, {
      companyId: nullableString(body.companyId || template.companyId),
      siteKey: nullableString(body.siteKey || template.siteKey || template.templateInfoJson?.ownership?.siteKey),
      sourceOrigin: nullableString(body.sourceOrigin),
      endpoint: '/ms/bg-flux-ms/compliance_property/edit_compliance',
      body: applyRequest,
    });
    sendJson(res, 200, {
      data: {
        editCompliance: sanitizeTemuCall(response),
        requestSummary: summarizeComplianceRequest(applyRequest),
      },
    }, origin);
  });
}

function sanitizeTemuCall(call) {
  return {
    endpoint: call.endpoint,
    status: call.status,
    origin: call.origin,
    mallId: call.mallId,
    payload: call.payload,
  };
}

function summarizeComplianceRequest(request) {
  return {
    goods_id: request.goods_id,
    spu_id: request.spu_id,
    cat_id: request.cat_id,
    taskCount: Array.isArray(request.template_edit_request_list) ? request.template_edit_request_list.length : 0,
  };
}

async function queryTemuProductExtCode({ spuId, companyId, siteKey, sourceOrigin }) {
  const normalizedSpuId = String(spuId || '').trim();
  if (!/^\d+$/.test(normalizedSpuId)) {
    throw new Error('缺少有效 SPU');
  }

  return withClient(async (client) => {
    const cookieRecord = await findCookieHeaderForTemu(client, { companyId, siteKey, sourceOrigin });
    if (!cookieRecord) {
      throw new Error('未找到 PluginCookieHeader cookieHeader');
    }

    const origin = originFromCookieRecord(cookieRecord, siteKey);
    const mallId = String(cookieRecord.mallId || extractCookieValue(cookieRecord.cookieHeader, 'mallid') || '').trim();
    if (!mallId) {
      throw new Error('PluginCookieHeader 缺少 mallId');
    }

    const response = await fetch(`${origin}/visage-agent-seller/product/skc/pageQuery`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieRecord.cookieHeader,
        mallid: mallId,
        origin,
        referer: `${origin}/goods/list`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        productIds: [Number(normalizedSpuId)],
        page: 1,
        pageSize: 20,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error_msg || payload.errorMsg || payload.error || `Temu HTTP ${response.status}`);
    }

    const pageItems = payload.result?.pageItems || payload.pageItems || [];
    const item = pageItems.find((entry) => String(entry?.productId) === normalizedSpuId) || pageItems[0];
    const extCode = String(item?.extCode || item?.extcode || '').trim();
    if (!extCode) {
      throw new Error('未找到对应货号 extCode');
    }

    return {
      extCode,
      spuId: normalizedSpuId,
      productId: item?.productId || Number(normalizedSpuId),
      productSkcId: item?.productSkcId || null,
      mallId,
    };
  });
}

async function handleProductExtCode(req, res, origin) {
  const body = await readBody(req);
  const data = await queryTemuProductExtCode({
    spuId: body.spuId,
    companyId: nullableString(body.companyId),
    siteKey: nullableString(body.siteKey),
    sourceOrigin: nullableString(body.sourceOrigin),
  });
  sendJson(res, 200, { data }, origin);
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

    if (req.method === 'GET' && url.pathname === '/api/compliance-info-templates/match') {
      await handleMatchTemplates(res, origin, url);
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

    if (req.method === 'POST' && url.pathname === '/api/compliance-info-templates/prepare-change') {
      await handlePrepareChange(req, res, origin);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/compliance-info-templates/dry-run-change') {
      await handleDryRunChange(req, res, origin);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/compliance-info-templates/apply-change') {
      await handleApplyChange(req, res, origin);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/temu/product-ext-code') {
      await handleProductExtCode(req, res, origin);
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
    sendJson(res, error.statusCode || 500, {
      error: error.message || 'Internal server error',
      ...(error.extra ? { details: error.extra } : {}),
    }, origin);
  }
}

const server = http.createServer(route);

server.listen(PORT, HOST, () => {
  console.log(`Compliance template API listening on http://${HOST}:${PORT}`);
});
