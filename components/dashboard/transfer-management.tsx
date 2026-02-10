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
import { ArrowRight, MoreHorizontal, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TransferManagementProps {
  assetManager: any;
}

const EMPLOYEES = [
  { id: 'E001', name: 'John Doe' },
  { id: 'E002', name: 'Jane Smith' },
  { id: 'E003', name: 'Mike Johnson' },
  { id: 'E004', name: 'Sarah Wilson' },
  { id: 'E005', name: 'Tom Brown' },
  { id: 'E006', name: 'Emily Davis' },
];

const transfers = [
  { id: 'T001', assetName: 'iPhone 15 Pro', fromEmployee: 'John Doe', toEmployee: 'Sarah Wilson', transferDate: '2023-10-01', status: 'Completed' },
  { id: 'T002', assetName: 'Dell XPS 15', fromEmployee: 'Jane Smith', toEmployee: 'Mike Johnson', transferDate: '2023-10-02', status: 'Pending' },
  { id: 'T003', assetName: 'Vodafone SIM', fromEmployee: 'Mike Johnson', toEmployee: 'Emily Davis', transferDate: '2023-10-03', status: 'Approved' },
];

export default function TransferManagement({ assetManager }: TransferManagementProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    assetId: '',
    fromEmployeeId: '',
    toEmployeeId: '',
    reason: '',
    transferDate: new Date().toISOString().split('T')[0],
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Get allocated assets
  const allocatedAssets = assetManager.allocations.filter((a: any) => a.status === 'Active');

  const handleInitiateTransfer = () => {
    if (newTransfer.assetId && newTransfer.fromEmployeeId && newTransfer.toEmployeeId && newTransfer.reason) {
      try {
        const fromEmployee = EMPLOYEES.find((e) => e.id === newTransfer.fromEmployeeId);
        const toEmployee = EMPLOYEES.find((e) => e.id === newTransfer.toEmployeeId);

        if (!fromEmployee || !toEmployee) {
          setStatus('error');
          setMessage('Employee not found');
          return;
        }

        assetManager.transferAsset(
          newTransfer.assetId,
          fromEmployee.id,
          fromEmployee.name,
          toEmployee.id,
          toEmployee.name,
          newTransfer.reason
        );

        setStatus('success');
        setMessage('Asset transferred successfully!');
        setShowNewForm(false);
        setNewTransfer({
          assetId: '',
          fromEmployeeId: '',
          toEmployeeId: '',
          reason: '',
          transferDate: new Date().toISOString().split('T')[0],
        });
        setTimeout(() => setStatus('idle'), 2000);
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while transferring the asset');
      }
    } else {
      setStatus('error');
      setMessage('Please fill in all required fields');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Pending':
      case 'Approved':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Asset Transfers</CardTitle>
            <CardDescription>
              Manage asset transfers between employees
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowNewForm(!showNewForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            + Initiate Transfer
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
                <Select value={newTransfer.assetId} onValueChange={(value) =>
                  setNewTransfer((prev) => ({ ...prev, assetId: value }))
                }>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {allocatedAssets.length === 0 ? (
                      <SelectItem value="none">No allocated assets</SelectItem>
                    ) : (
                      allocatedAssets.map((alloc: any) => {
                        const asset = assetManager.assets.find((a: any) => a.id === alloc.assetId);
                        return (
                          <SelectItem key={alloc.assetId} value={alloc.assetId}>
                            {asset?.name || 'Unknown'} ({alloc.employeeName})
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmployee" className="text-foreground">
                  From
                </Label>
                <Select value={newTransfer.fromEmployeeId} onValueChange={(value) =>
                  setNewTransfer((prev) => ({ ...prev, fromEmployeeId: value }))
                }>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="From employee" />
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
                <Label htmlFor="toEmployee" className="text-foreground">
                  To
                </Label>
                <Select value={newTransfer.toEmployeeId} onValueChange={(value) =>
                  setNewTransfer((prev) => ({ ...prev, toEmployeeId: value }))
                }>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="To employee" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">
                Transfer Reason *
              </Label>
              <Input
                id="reason"
                placeholder="e.g., Employee change, Project assignment"
                value={newTransfer.reason}
                onChange={(e) =>
                  setNewTransfer((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="bg-input"
              />
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
                onClick={handleInitiateTransfer}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Transfer Request
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Transfers Table */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-b border-border">
                  <TableHead className="font-semibold">Transfer ID</TableHead>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">From</TableHead>
                  <TableHead className="text-center font-semibold">To</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetManager.transfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transfers found. Initiate a transfer to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  assetManager.transfers.map((transfer: any) => {
                    const asset = assetManager.assets.find((a: any) => a.id === transfer.assetId);
                    return (
                      <TableRow key={transfer.id} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="font-medium text-primary">{transfer.id}</TableCell>
                        <TableCell>{asset?.name || 'Unknown'}</TableCell>
                        <TableCell className="text-sm">{transfer.fromEmployeeName}</TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="w-4 h-4 text-muted-foreground inline" />
                        </TableCell>
                        <TableCell className="text-sm">{transfer.toEmployeeName}</TableCell>
                        <TableCell className="text-sm">{transfer.transferDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transfer.status)}
                            <Badge className={getStatusColor(transfer.status)}>
                              {transfer.status}
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
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
            Showing {assetManager.transfers.length} transfers
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
