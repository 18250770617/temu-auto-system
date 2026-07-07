# Temu Compliance Template Collector

Chrome MV3 extension for Temu Agent Seller compliance information pages:

`https://agentseller.temu.com/govern/information-supplementation`

The content script watches for the compliance edit drawer. When the drawer is open, it inserts a `设为模板` button into the drawer footer. Clicking the button collects normalized compliance fields, asks for a template name, and saves the result through the local API into Postgres.

## Update Notes

- Added drawer-only template saving for Temu compliance information.
- Added a local Node API and Postgres table `"ComplianceInfoTemplate"`.
- Template ownership is resolved through the local `"Shop"` table by internal shop id, platform shop id, or shop name.
- Saved templates can be listed, viewed as JSON, replaced on duplicate names, and deleted.

## Local API and Database

From `D:\auto-system`:

```powershell
npm run migrate:compliance-template
npm run dev:api
```

Defaults:

- API: `http://127.0.0.1:8787`
- DB: `postgres://postgres:postgres@127.0.0.1:5432/ecommerce_aggregation`
- Override API port with `COMPLIANCE_TEMPLATE_API_PORT` or `PORT`.
- Override database with `DATABASE_URL`.

The migration creates table `"ComplianceInfoTemplate"` with a unique constraint on `companyId + shopId + name`.

## Load Extension

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click `Load unpacked`.
4. Select:

```text
D:\auto-system\chrome-extension\temu-compliance-template
```

## Workflow

1. Open the Temu compliance information page.
2. Open a product compliance edit drawer.
3. Click `设为模板` in the drawer footer.
4. Enter a template name and confirm.
5. On success, the page shows a toast and DevTools Console prints the normalized JSON under `[TemuComplianceTemplate]`.

The latest collected JSON is also available in the page as:

```js
window.__TEMU_COMPLIANCE_TEMPLATE__
```

Duplicate names in the same `companyId + shopId` show an error and a `替换原模板` action.
