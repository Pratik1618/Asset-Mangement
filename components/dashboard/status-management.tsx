'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StatusManagementProps {
  assetManager: any;
}

export default function StatusManagement({ assetManager }: StatusManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [dialogAction, setDialogAction] = useState<'activate' | 'deactivate' | null>(null);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const assets = assetManager.assets || [];

  const activeCount = assets.filter((a: any) => a.status === 'active').length;
  const inactiveCount = assets.filter((a: any) => a.status === 'inactive').length;

  const filteredAssets = assets.filter((asset: any) => {
    if (filterStatus === 'Active' && asset.status !== 'active') return false;
    if (filterStatus === 'Inactive' && asset.status !== 'inactive') return false;
    return (
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openDialog = (assetId: string, action: 'activate' | 'deactivate') => {
    setSelectedAssetId(assetId);
    setDialogAction(action);
    setDeactivateReason('');
    setShowDialog(true);
  };

  const confirmStatusChange = () => {
    if (!selectedAssetId || !dialogAction) return;

    const newStatus = dialogAction === 'activate' ? 'active' : 'inactive';
    assetManager.toggleAssetStatus(selectedAssetId, newStatus);
    setShowDialog(false);
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {assetManager.assets.length > 0
                    ? `${Math.round((activeCount / assetManager.assets.length) * 100)}% of total`
                    : '0% of total'}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200 dark:text-green-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {assetManager.assets.length > 0
                    ? `${Math.round((inactiveCount / assetManager.assets.length) * 100)}% of total`
                    : '0% of total'}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-200 dark:text-red-800" />
            </div>
          </CardContent>
        </Card>

      
      </div>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Status Management</CardTitle>
            <CardDescription>
              Activate or deactivate assets as needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'All' | 'Active' | 'Inactive')}>
                <SelectTrigger className="w-40 bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Assets</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="border-b border-border">
                    <TableHead className="font-semibold">Asset ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Serial Number</TableHead>
                    <TableHead className="font-semibold">Allocated To</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset: any) => {
                      const allocation = assetManager.allocations.find(
                        (a: any) => a.assetId === asset.id && a.status !== 'Returned'
                      );
                      const date = new Date(asset.createdAt);
                      const formattedDate = date.toLocaleString();
                      return (
                        <TableRow key={asset.id} className="border-b border-border hover:bg-muted/50">
                          <TableCell className="font-medium text-primary">{asset.id}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell className="text-sm">
                            <Badge variant="outline" className="capitalize">
                              {asset.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-mono">{asset.serialNumber}</TableCell>
                          <TableCell>{allocation?.employeeName || 'Unallocated'}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                asset.status === 'active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }
                            >
                              {asset.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formattedDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {asset.status === 'active' && (
                                  <DropdownMenuItem onClick={() => openDialog(asset.id, 'deactivate')}>
                                    Deactivate Asset
                                  </DropdownMenuItem>
                                )}
                                {asset.status === 'inactive' && (
                                  <DropdownMenuItem onClick={() => openDialog(asset.id, 'activate')}>
                                    Activate Asset
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {assetManager.assets.length === 0
                          ? 'No assets found. Create an asset to get started.'
                          : 'No assets match your filters.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredAssets.length} of {assetManager.assets.length} assets</span>
            </div>
          </CardContent>
        </Card>

      {/* Status Change Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogAction === 'activate' ? 'Activate Asset' : 'Deactivate Asset'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === 'activate'
                ? 'This asset will be marked as active and available for allocation.'
                : 'Please provide a reason for deactivation.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {dialogAction === 'deactivate' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-foreground">
                  Reason for Deactivation *
                </Label>
                <textarea
                  id="reason"
                  placeholder="e.g., Device damaged, Hardware failure, Replacement requested..."
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={dialogAction === 'deactivate' && !deactivateReason}
              className={dialogAction === 'activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {dialogAction === 'activate' ? 'Activate' : 'Deactivate'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
