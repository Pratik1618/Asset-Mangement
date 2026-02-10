'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, AlertCircle, Clock, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active':
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case 'Pending':
      return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case 'Returned':
      return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Returned':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface AllocationManagementProps {
  assetManager: any;
}

const EMPLOYEES = [
  { id: 'E001', name: 'John Doe' },
  { id: 'E002', name: 'Jane Smith' },
  { id: 'E003', name: 'Mike Johnson' },
  { id: 'E004', name: 'Sarah Wilson' },
  { id: 'E005', name: 'Tom Brown' },
];

const allocations = [
  { id: 'AL001', assetName: 'iPhone 15 Pro', employeeName: 'John Doe', allocationDate: '2023-10-01', status: 'Active' },
  { id: 'AL002', assetName: 'Dell XPS 15', employeeName: 'Jane Smith', allocationDate: '2023-10-02', status: 'Pending' },
  { id: 'AL003', assetName: 'Vodafone SIM', employeeName: 'Mike Johnson', allocationDate: '2023-10-03', status: 'Returned' },
];

export default function AllocationManagement({ assetManager }: AllocationManagementProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAllocation, setNewAllocation] = useState({
    assetId: '',
    employeeId: '',
    allocationDate: new Date().toISOString().split('T')[0],
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleAllocate = () => {
    if (newAllocation.assetId && newAllocation.employeeId) {
      try {
        const employee = EMPLOYEES.find((e) => e.id === newAllocation.employeeId);
        if (!employee) {
          setStatus('error');
          setMessage('Employee not found');
          return;
        }

        assetManager.allocateAsset(
          newAllocation.assetId,
          newAllocation.employeeId,
          employee.name,
          newAllocation.allocationDate
        );

        setStatus('success');
        setMessage('Asset allocated successfully!');
        setShowNewForm(false);
        setNewAllocation({
          assetId: '',
          employeeId: '',
          allocationDate: new Date().toISOString().split('T')[0],
        });

        setTimeout(() => setStatus('idle'), 2000);
      } catch (error) {
        setStatus('error');
        setMessage('Error allocating asset. Asset may already be allocated.');
      }
    } else {
      setStatus('error');
      setMessage('Please select both asset and employee');
    }
  };

  const handleReturnAsset = (allocationId: string) => {
    assetManager.returnAsset(allocationId);
    setStatus('success');
    setMessage('Asset returned successfully!');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'Returned':
        return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Returned':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unallocated assets
  const unallocatedAssets = assetManager.assets.filter(
    (asset: any) =>
      asset.status === 'active' &&
      !assetManager.allocations.some(
        (a: any) => a.assetId === asset.id && a.status !== 'Returned'
      )
  );

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Asset Allocations</CardTitle>
            <CardDescription>
              Manage asset allocations to employees
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            + New Allocation
          </Button>
        </CardHeader>

        {status === 'success' && (
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">{message}</span>
            </div>
          </CardContent>
        )}

        {status === 'error' && (
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">{message}</span>
            </div>
          </CardContent>
        )}

        {showNewForm && (
          <CardContent className="space-y-4 border-t border-border pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset" className="text-foreground">
                  Asset
                </Label>
                <Select value={newAllocation.assetId} onValueChange={(value) =>
                  setNewAllocation((prev) => ({ ...prev, assetId: value }))
                }>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {unallocatedAssets.length === 0 ? (
                      <SelectItem value="none">No unallocated assets</SelectItem>
                    ) : (
                      unallocatedAssets.map((asset: any) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} ({asset.serialNumber})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee" className="text-foreground">
                  Employee
                </Label>
                <Select value={newAllocation.employeeId} onValueChange={(value) =>
                  setNewAllocation((prev) => ({ ...prev, employeeId: value }))
                }>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEES.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">
                  Allocation Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newAllocation.allocationDate}
                  onChange={(e) =>
                    setNewAllocation((prev) => ({ ...prev, allocationDate: e.target.value }))
                  }
                  className="bg-input"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAllocate}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Allocate Asset
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Allocations Table */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-b border-border">
                  <TableHead className="font-semibold">Allocation ID</TableHead>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetManager.allocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No allocations found. Create an asset and allocate it to an employee to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  assetManager.allocations.map((allocation: any) => {
                    const asset = assetManager.assets.find((a: any) => a.id === allocation.assetId);
                    return (
                      <TableRow key={allocation.id} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="font-medium text-primary">{allocation.id}</TableCell>
                        <TableCell>{asset?.name || 'Unknown'}</TableCell>
                        <TableCell>{allocation.employeeName}</TableCell>
                        <TableCell className="text-sm">{allocation.allocationDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(allocation.status)}
                            <Badge className={getStatusColor(allocation.status)}>
                              {allocation.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {allocation.status === 'Active' && (
                                <DropdownMenuItem onClick={() => handleReturnAsset(allocation.id)}>
                                  Return Asset
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {assetManager.allocations.length} allocations
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
