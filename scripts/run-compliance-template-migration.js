const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const DEFAULT_DATABASE_URL = 'postgres://postgres:postgres@127.0.0.1:5432/ecommerce_aggregation';

async function main() {
  const migrationPath = path.resolve(__dirname, '..', 'migrations', '20260707093000_compliance_info_template.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const client = new Client({
    connectionString: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log('ComplianceInfoTemplate migration applied.');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Failed to apply ComplianceInfoTemplate migration.');
  console.error(error);
  process.exit(1);
});
