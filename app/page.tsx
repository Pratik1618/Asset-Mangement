'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetMaster from '@/components/dashboard/asset-master';
import AssetCreation from '@/components/dashboard/asset-creation';
import AllocationManagement from '@/components/dashboard/allocation-management';
import TransferManagement from '@/components/dashboard/transfer-management';
import AuditTrail from '@/components/dashboard/audit-trail';
import BulkImport from '@/components/dashboard/bulk-import';
import ReportsAnalytics from '@/components/dashboard/reports-analytics';
import Navigation from '@/components/layout/navigation';
import StatusManagement from '@/components/dashboard/status-management';
import { useAssetManagement } from '@/hooks/useAssetManagement';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const assetManager = useAssetManagement();

  return (
    <div className="flex h-screen bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Asset Management System</h1>
            <p className="text-muted-foreground mt-2">Manage SIM Cards, Phones, and Laptops</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-8 bg-card border border-border">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="assets">Assets Master</TabsTrigger>
              <TabsTrigger value="create">Create Asset</TabsTrigger>
              <TabsTrigger value="allocate">Allocations</TabsTrigger>
              <TabsTrigger value="transfer">Transfers</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              <TabsTrigger value="import">Bulk Import</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardOverview assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="assets">
              <AssetMaster assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="create">
              <AssetCreation assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="allocate">
              <AllocationManagement assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="transfer">
              <TransferManagement assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="status">
              <StatusManagement assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="audit">
              <AuditTrail assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="import">
              <BulkImport assetManager={assetManager} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsAnalytics assetManager={assetManager} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function DashboardOverview({ assetManager }: any) {
  const stats = assetManager.getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalAssets}</div>
          <p className="text-xs text-muted-foreground mt-1">All assets</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Allocated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.allocatedAssets}</div>
          <p className="text-xs text-muted-foreground mt-1">To employees</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.activeAssets}</div>
          <p className="text-xs text-muted-foreground mt-1">In use</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.inactiveAssets}</div>
          <p className="text-xs text-muted-foreground mt-1">Decommissioned</p>
        </CardContent>
      </Card>
    </div>
  );
}
