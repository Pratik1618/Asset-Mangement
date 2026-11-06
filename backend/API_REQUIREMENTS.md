# Asset Management — FastAPI Backend Requirements

Spec for the Python backend that will replace the current `localStorage`-based
state in [hooks/useAssetManagement.ts](../hooks/useAssetManagement.ts). The data
model below is aligned with the existing schema in
[scripts/create-asset-schema.sql](../scripts/create-asset-schema.sql); differences
are called out where the frontend currently diverges from that schema.

## 1. Tech stack

- **Framework:** FastAPI
- **DB driver/ORM:** SQLAlchemy 2.x (async) + `asyncpg`
- **Validation:** Pydantic v2
- **Migrations:** Alembic, seeded from `scripts/create-asset-schema.sql`
- **Database:** PostgreSQL
- **Auth:** JWT bearer tokens (OAuth2 password flow)
- **Docs:** auto-generated OpenAPI at `/docs` (FastAPI default)

## 2. Cross-cutting requirements

- Base path: `/api/v1`
- All list endpoints support pagination (`page`, `page_size`) and return:
  ```json
  { "items": [...], "total": 0, "page": 1, "page_size": 20 }
  ```
- All list endpoints support filtering by the fields noted per-resource below, via query params.
- Error responses use a consistent shape:
  ```json
  { "detail": "message", "code": "ASSET_NOT_FOUND" }
  ```
- Every create/update/delete/allocate/transfer/activate action must write an
  `audit_logs` row (see §3.7) — this is currently done client-side in
  `addAuditLog` and must move server-side.
- CORS must allow the Next.js frontend origin(s), configurable via env var.
- All timestamps are UTC ISO-8601.
- Auth: every endpoint except `/auth/login` requires a valid bearer token. The
  current frontend hard-codes `performedBy: 'Admin'` — the backend must derive
  the acting user from the authenticated session instead.

## 3. Resources

### 3.1 Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Exchange email/password for a JWT access token |
| GET | `/auth/me` | Return the current authenticated employee |

### 3.2 Employees

Maps to `employees` table.

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| name | string | required |
| email | string | required, unique |
| employee_id | string | required, unique |
| department | string | optional |
| position | string | optional |
| is_active | bool | default true |

| Method | Path | Description |
|---|---|---|
| GET | `/employees` | List, filter by `department`, `is_active`, `q` (name/email search) |
| GET | `/employees/{id}` | Get one |
| POST | `/employees` | Create |
| PATCH | `/employees/{id}` | Update |
| DELETE | `/employees/{id}` | Soft delete (sets `is_active=false`) |

### 3.3 Asset Types

Maps to `asset_types` table. Frontend currently hard-codes
`phone | laptop | sim-card | other` in [asset-creation.tsx](../components/dashboard/asset-creation.tsx);
this resource replaces that hard-coded list so new types can be added without a frontend deploy.

| Method | Path | Description |
|---|---|---|
| GET | `/asset-types` | List all |
| POST | `/asset-types` | Create (`name`, `description`) |

### 3.4 Assets

Maps to `assets` table. Frontend model is `Asset` in
[useAssetManagement.ts](../hooks/useAssetManagement.ts) and the create form in
[asset-creation.tsx](../components/dashboard/asset-creation.tsx).

| Field | Type | Notes |
|---|---|---|
| id | int | PK |
| asset_code | string | required, unique — auto-generated if omitted |
| asset_type_id | int | required, FK → asset_types |
| name | string | required (not in SQL schema yet — add column) |
| brand / manufacturer | string | optional |
| model | string | optional |
| serial_number | string | required |
| purchase_date | date | optional |
| purchase_cost | decimal | optional |
| supplier | string | optional (not in SQL schema yet — add column) |
| warranty_period_months | int | optional (not in SQL schema yet — add column) |
| status | enum | `active`, `inactive`, `decommissioned` |
| depreciation_rate | decimal | optional, default 0 |
| notes | text | optional |
| specification | jsonb | optional, free-form |

| Method | Path | Description |
|---|---|---|
| GET | `/assets` | List, filter by `status`, `asset_type_id`, `q` (name/serial search) |
| GET | `/assets/{id}` | Get one, including its current allocation if any |
| POST | `/assets` | Create → writes `audit_logs` action `CREATE` |
| PATCH | `/assets/{id}` | Update |
| DELETE | `/assets/{id}` | Delete (only if never allocated; otherwise reject) |
| PATCH | `/assets/{id}/status` | Activate/deactivate/decommission → writes `audit_logs` + `asset_activations` row |

### 3.5 Allocations

Maps to `asset_allocations` table / `Allocation` type. Business rule from
[useAssetManagement.ts](../hooks/useAssetManagement.ts) `allocateAsset`: an asset
can have at most one non-returned allocation at a time — enforce this
server-side (currently only checked client-side).

| Method | Path | Description |
|---|---|---|
| GET | `/allocations` | List, filter by `asset_id`, `employee_id`, `status` |
| GET | `/allocations/{id}` | Get one |
| POST | `/allocations` | Allocate an asset to an employee (reject if asset already actively allocated) → writes `audit_logs` action `ALLOCATE` |
| POST | `/allocations/{id}/return` | Mark returned, sets `deallocation_date` → writes `audit_logs` action `DEALLOCATE` |

### 3.6 Transfers

Maps to `asset_transfers` table / `Transfer` type. Per `transferAsset` in the
hook, a transfer must atomically: close the current allocation, insert a
transfer record, and open a new allocation for the receiving employee —
this must be one DB transaction server-side.

| Method | Path | Description |
|---|---|---|
| GET | `/transfers` | List, filter by `asset_id`, `from_employee_id`, `to_employee_id`, `approval_status` |
| GET | `/transfers/{id}` | Get one |
| POST | `/transfers` | Create transfer (`asset_id`, `to_employee_id`, `reason`) → closes old allocation, opens new one, writes `audit_logs` action `TRANSFER` |
| PATCH | `/transfers/{id}/approve` | Set `approval_status=approved` |
| PATCH | `/transfers/{id}/reject` | Set `approval_status=rejected` |

### 3.7 Audit Logs

Maps to `audit_logs` table / `AuditLog` type. Read-only from the API's
perspective — rows are written internally by the other endpoints above, not
submitted directly by clients.

| Method | Path | Description |
|---|---|---|
| GET | `/audit-logs` | List, filter by `table_name`, `record_id`, `action`, `changed_by`, date range |

### 3.8 Bulk Import

Maps to `bulk_import_logs` table and [bulk-import.tsx](../components/dashboard/bulk-import.tsx).
Required CSV columns per the frontend's documented template: `Asset Name`
(required), `Asset Type` (required, one of the asset type names), `Serial
Number` (required), `Manufacturer`, `Model`, `Purchase Date`, `Cost`
(all optional).

| Method | Path | Description |
|---|---|---|
| GET | `/bulk-import/template` | Download CSV template |
| POST | `/bulk-import/preview` | Upload CSV, return per-row validation (`valid`/`invalid` + message) without persisting |
| POST | `/bulk-import/commit` | Persist the previously-previewed valid rows as assets, write one `bulk_import_logs` row + an `audit_logs` row per created asset |
| GET | `/bulk-import/logs` | List past import runs |

### 3.9 Depreciation

Maps to `asset_depreciation` table. Not currently surfaced in the frontend,
but the table exists in the SQL schema — expose read access for future use by
Reports & Analytics.

| Method | Path | Description |
|---|---|---|
| GET | `/assets/{id}/depreciation` | Depreciation history for one asset |
| POST | `/assets/{id}/depreciation/recalculate` | Recompute book value from `purchase_cost` and `depreciation_rate` |

### 3.10 Reports & Analytics

Backs [reports-analytics.tsx](../components/dashboard/reports-analytics.tsx),
which is currently fully hard-coded sample data. All values below must be
computed server-side from the tables above.

| Method | Path | Description |
|---|---|---|
| GET | `/reports/summary` | KPI cards: total assets, allocated count, total inventory value, average asset age |
| GET | `/reports/by-type` | Asset count + total cost per `asset_type` (pie chart + bar chart data) |
| GET | `/reports/by-status` | Asset count per `status` |
| GET | `/reports/monthly-activity` | Per-month counts of allocations, transfers, deactivations, for a given date range |

### 3.11 Dashboard stats

Backs `getStats()` in the hook, used for the dashboard overview.

| Method | Path | Description |
|---|---|---|
| GET | `/stats` | `{ totalAssets, activeAssets, allocatedAssets, pendingTransfers, inactiveAssets }` |

## 4. Schema gaps to resolve before implementation

The current `scripts/create-asset-schema.sql` needs these additions to match
what the frontend already collects:

- `assets.name` (frontend's primary asset label, distinct from `brand`/`model`)
- `assets.supplier`
- `assets.warranty_period_months`
- `employees` needs no changes, but allocations/transfers currently store
  denormalized `employeeName` on the frontend — the API should return the
  joined employee name rather than storing it redundantly.

## 5. Out of scope for v1

- File storage for asset photos/attachments
- Role-based permissions beyond a single authenticated-admin model
- Real-time updates (websockets) — polling is sufficient initially
