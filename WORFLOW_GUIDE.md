# Asset Management System - Workflow Guide

## Overview

This enterprise asset management system now has full localStorage-based workflow for creating, allocating, and transferring assets. All data persists automatically across sessions.

## Architecture

### State Management: `hooks/useAssetManagement.ts`

The `useAssetManagement` hook provides centralized state management with localStorage persistence:

```typescript
const assetManager = useAssetManagement();
```

**Key Data Structures:**
- `assets` - Array of all assets
- `allocations` - Array of asset allocations to employees
- `transfers` - Array of asset transfers between employees
- `auditLogs` - Complete audit trail of all activities

### Workflow Steps

## 1. Create Asset

**Location:** Dashboard → Create Asset Tab

**Process:**
1. Fill in asset details (name, type, serial number, etc.)
2. Click "Create Asset"
3. Asset is added to inventory with status "active"
4. Audit log entry created: "Create"

**Data Stored:**
- Asset record with unique ID (ASSET + timestamp)
- Status: "active"
- All metadata (manufacturer, cost, warranty, etc.)

## 2. Allocate Asset to Employee

**Location:** Dashboard → Allocations Tab

**Process:**
1. Click "+ New Allocation"
2. Select unallocated asset from dropdown (only shows available assets)
3. Select employee to allocate to
4. Set allocation date
5. Click "Allocate Asset"
6. Asset is marked as allocated
7. Audit log entry created: "Allocate"

**Workflow Rules:**
- Only unallocated and active assets appear in dropdown
- An asset can only be allocated once (must be returned first)
- Allocation status: "Active" when allocated
- "Returned" when employee returns the asset

## 3. Transfer Asset Between Employees

**Location:** Dashboard → Transfers Tab

**Process (Instant Transfer):**
1. Click "+ Initiate Transfer"
2. Select asset from allocated assets dropdown
3. Select "From" employee (current owner)
4. Select "To" employee (new owner)
5. Enter transfer reason (required)
6. Click "Submit Transfer Request"

**What Happens Instantly:**
1. Current allocation marked as "Returned"
2. New allocation created for new employee
3. Transfer record created with status "Completed"
4. Audit log entries created: "Transfer"

**Transfer Tracking:**
- All transfers appear in Transfers table
- Status shows "Completed" for instant transfers
- Shows from/to employees and reason

## 4. Activate/Deactivate Assets

**Location:** Dashboard → Status Tab

**Process:**

**To Deactivate:**
1. Find asset in table
2. Click action menu (...) → "Deactivate Asset"
3. Dialog appears requiring deactivation reason
4. Enter reason (required field)
5. Click "Deactivate"
6. Asset status changes to "inactive"
7. Audit log entry created: "Deactivate"

**To Activate:**
1. Find asset in table
2. Click action menu (...) → "Activate Asset"
3. Confirm activation
4. Asset status changes to "active"
5. Audit log entry created: "Activate"

**Rules:**
- Inactive assets cannot be allocated
- Deactivation reason is required and logged
- All status changes are audited

## 5. View Asset Master (Inventory)

**Location:** Dashboard → Assets Master Tab

**Features:**
- View all assets with current allocation info
- Search by name, serial number, or asset ID
- Filter by asset type
- See allocation dates
- Status badges (Active/Inactive)

## 6. Track Audit Trail

**Location:** Dashboard → Audit Trail Tab

**Information Tracked:**
- Action type (Create, Allocate, Transfer, Activate, Deactivate, Return)
- Asset ID and Name
- Employee name (when applicable)
- Timestamp with full date/time
- Detailed description of action
- Reason (for deactivations)

**Searchable by:**
- Asset name
- Asset ID
- Action type
- Employee name
- Description

## Data Persistence

All data is automatically saved to localStorage with these keys:
- `asset_management_assets`
- `asset_management_allocations`
- `asset_management_transfers`
- `asset_management_audit_logs`

**Data persists across:**
- Browser refreshes
- Tab closures
- Browser reopens
- Different devices (separate storage)

## Dashboard Overview

The main dashboard shows real-time KPIs:
- **Total Assets:** All assets created
- **Allocated:** Currently allocated to employees
- **Active Assets:** In use status
- **Inactive Assets:** Decommissioned assets

All numbers update automatically as you perform operations.

## Sample Workflow

1. **Create 3 assets:**
   - Create → iPhone 15 Pro (phone)
   - Create → Dell XPS 15 (laptop)
   - Create → Vodafone SIM (sim-card)

2. **Allocate assets:**
   - Allocate iPhone to John Doe (2024-01-15)
   - Allocate Dell XPS to Jane Smith (2024-01-20)
   - Allocate SIM to Mike Johnson (2024-02-01)

3. **Transfer asset:**
   - Transfer iPhone from John Doe to Sarah Wilson (Reason: "Department change")

4. **Deactivate asset:**
   - Deactivate Dell XPS (Reason: "Hardware failure")

5. **Check Audit Trail:**
   - See all 7 actions logged with timestamps

6. **View Dashboard:**
   - Total Assets: 3
   - Allocated: 2 (iPhone to Sarah, SIM to Mike)
   - Active Assets: 2 (iPhone, SIM)
   - Inactive Assets: 1 (Dell XPS)

## Technical Implementation

### Hook Functions

```typescript
// Create new asset
createAsset(assetData)

// Allocate asset
allocateAsset(assetId, employeeId, employeeName, allocationDate)

// Transfer asset (instant)
transferAsset(assetId, fromEmpId, fromEmpName, toEmpId, toEmpName, reason)

// Return asset
returnAsset(allocationId)

// Change asset status
toggleAssetStatus(assetId, newStatus)

// Get statistics
getStats()

// Clear all data
clearAllData()
```

### Component Props

All dashboard components receive `assetManager` prop:
```typescript
<AssetCreation assetManager={assetManager} />
<AssetMaster assetManager={assetManager} />
<AllocationManagement assetManager={assetManager} />
<TransferManagement assetManager={assetManager} />
<StatusManagement assetManager={assetManager} />
<AuditTrail assetManager={assetManager} />
```

## Error Handling

- Asset name/type/serial validation on creation
- Duplicate allocation prevention
- Employee not found error messaging
- Missing required fields validation
- Status messages shown for all operations

## Future Enhancements

To connect to a backend:
1. Replace localStorage calls with API calls in `useAssetManagement.ts`
2. Add API endpoints for CRUD operations
3. Implement authentication
4. Add database persistence
5. Add multi-user support with role-based access
