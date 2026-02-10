'use client';

import { useState, useEffect } from 'react';

export interface Asset {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'sim-card' | 'other';
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  cost: string;
  supplier: string;
  warrantyPeriod: string;
  notes: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  employeeId: string;
  employeeName: string;
  allocationDate: string;
  status: 'Active' | 'Pending' | 'Returned';
  createdAt: string;
}

export interface Transfer {
  id: string;
  assetId: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  transferDate: string;
  reason: string;
  status: 'Completed' | 'Pending' | 'Rejected';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: 'Create' | 'Allocate' | 'Transfer' | 'Activate' | 'Deactivate' | 'Return';
  assetId: string;
  assetName: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  ASSETS: 'asset_management_assets',
  ALLOCATIONS: 'asset_management_allocations',
  TRANSFERS: 'asset_management_transfers',
  AUDIT_LOGS: 'asset_management_audit_logs',
};

export function useAssetManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedAssets = localStorage.getItem(STORAGE_KEYS.ASSETS);
        const storedAllocations = localStorage.getItem(STORAGE_KEYS.ALLOCATIONS);
        const storedTransfers = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
        const storedAuditLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);

        if (storedAssets) setAssets(JSON.parse(storedAssets));
        if (storedAllocations) setAllocations(JSON.parse(storedAllocations));
        if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
        if (storedAuditLogs) setAuditLogs(JSON.parse(storedAuditLogs));
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      setIsLoaded(true);
    };

    loadFromStorage();
  }, []);

  // Save assets to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    }
  }, [assets, isLoaded]);

  // Save allocations to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.ALLOCATIONS, JSON.stringify(allocations));
    }
  }, [allocations, isLoaded]);

  // Save transfers to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
    }
  }, [transfers, isLoaded]);

  // Save audit logs to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    }
  }, [auditLogs, isLoaded]);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `LOG${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createAsset = (assetData: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ASSET${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssets((prev) => [newAsset, ...prev]);
    addAuditLog({
      action: 'Create',
      assetId: newAsset.id,
      assetName: newAsset.name,
      details: `Asset created: ${newAsset.name} (${newAsset.serialNumber})`,
      performedBy: 'Admin',
    });
    return newAsset;
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updates } : asset))
    );
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const allocateAsset = (
    assetId: string,
    employeeId: string,
    employeeName: string,
    allocationDate: string
  ) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return null;

    // Check if asset is already allocated
    const existingAllocation = allocations.find(
      (a) => a.assetId === assetId && a.status !== 'Returned'
    );
    if (existingAllocation) {
      console.error('Asset is already allocated');
      return null;
    }

    const newAllocation: Allocation = {
      id: `ALLOC${Date.now()}`,
      assetId,
      employeeId,
      employeeName,
      allocationDate,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    setAllocations((prev) => [newAllocation, ...prev]);
    addAuditLog({
      action: 'Allocate',
      assetId,
      assetName: asset.name,
      details: `Asset allocated to ${employeeName}`,
      performedBy: 'Admin',
    });

    return newAllocation;
  };

  const returnAsset = (allocationId: string) => {
    const allocation = allocations.find((a) => a.id === allocationId);
    if (!allocation) return null;

    setAllocations((prev) =>
      prev.map((a) =>
        a.id === allocationId ? { ...a, status: 'Returned' } : a
      )
    );

    const asset = assets.find((a) => a.id === allocation.assetId);
    if (asset) {
      addAuditLog({
        action: 'Return',
        assetId: allocation.assetId,
        assetName: asset.name,
        details: `Asset returned from ${allocation.employeeName}`,
        performedBy: 'Admin',
      });
    }
  };

  const transferAsset = (
    assetId: string,
    fromEmployeeId: string,
    fromEmployeeName: string,
    toEmployeeId: string,
    toEmployeeName: string,
    reason: string
  ) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return null;

    // Return current allocation
    const currentAllocation = allocations.find(
      (a) => a.assetId === assetId && a.status !== 'Returned'
    );
    if (currentAllocation) {
      setAllocations((prev) =>
        prev.map((a) =>
          a.id === currentAllocation.id ? { ...a, status: 'Returned' } : a
        )
      );
    }

    // Create new transfer record
    const newTransfer: Transfer = {
      id: `TRANS${Date.now()}`,
      assetId,
      fromEmployeeId,
      fromEmployeeName,
      toEmployeeId,
      toEmployeeName,
      transferDate: new Date().toISOString().split('T')[0],
      reason,
      status: 'Completed',
      createdAt: new Date().toISOString(),
    };

    setTransfers((prev) => [newTransfer, ...prev]);

    // Create new allocation for new employee
    const newAllocation: Allocation = {
      id: `ALLOC${Date.now()}`,
      assetId,
      employeeId: toEmployeeId,
      employeeName: toEmployeeName,
      allocationDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    setAllocations((prev) => [newAllocation, ...prev]);

    addAuditLog({
      action: 'Transfer',
      assetId,
      assetName: asset.name,
      details: `Asset transferred from ${fromEmployeeName} to ${toEmployeeName}. Reason: ${reason}`,
      performedBy: 'Admin',
    });

    return newTransfer;
  };

  const toggleAssetStatus = (assetId: string, newStatus: 'active' | 'inactive') => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return null;

    updateAsset(assetId, { status: newStatus });
    addAuditLog({
      action: newStatus === 'active' ? 'Activate' : 'Deactivate',
      assetId,
      assetName: asset.name,
      details: `Asset ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      performedBy: 'Admin',
    });
  };

  const getAssetWithAllocation = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    const allocation = allocations.find(
      (a) => a.assetId === assetId && a.status !== 'Returned'
    );
    return { asset, allocation };
  };

  const getStats = () => {
    const totalAssets = assets.length;
    const activeAssets = assets.filter((a) => a.status === 'active').length;
    const allocatedAssets = allocations.filter((a) => a.status === 'Active').length;
    const pendingTransfers = transfers.filter((t) => t.status === 'Pending').length;
    const inactiveAssets = assets.filter((a) => a.status === 'inactive').length;

    return {
      totalAssets,
      activeAssets,
      allocatedAssets,
      pendingTransfers,
      inactiveAssets,
    };
  };

  const clearAllData = () => {
    setAssets([]);
    setAllocations([]);
    setTransfers([]);
    setAuditLogs([]);
  };

  return {
    assets,
    allocations,
    transfers,
    auditLogs,
    isLoaded,
    createAsset,
    updateAsset,
    deleteAsset,
    allocateAsset,
    returnAsset,
    transferAsset,
    toggleAssetStatus,
    getAssetWithAllocation,
    getStats,
    clearAllData,
  };
}
