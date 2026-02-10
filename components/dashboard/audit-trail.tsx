'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  assetId: string;
  assetName: string;
  performedBy: string;
  details: string;
  changeType: 'Create' | 'Update' | 'Transfer' | 'Allocate' | 'Activate' | 'Deactivate';
}

interface AuditTrailProps {
  assetManager: any;
}

export default function AuditTrail({ assetManager }: AuditTrailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const auditLogs = assetManager.auditLogs;

  const filteredLogs = auditLogs.filter((log: any) => {
    const matchesSearch =
      log.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'Create':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Update':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Transfer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Allocate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Activate':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Deactivate':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            Complete history of all asset management activities and changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset, action, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-b border-border">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">Performed By</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log: any) => {
                    const date = new Date(log.timestamp);
                    const formattedTime = date.toLocaleString();
                    return (
                      <TableRow key={log.id} className="border-b border-border hover:bg-muted/50">
                        <TableCell className="text-sm font-medium">{formattedTime}</TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-primary">{log.assetId}</div>
                            <div className="text-sm text-muted-foreground">{log.assetName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{log.performedBy}</TableCell>
                        <TableCell>
                          <Badge className={getChangeTypeColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {assetManager.auditLogs.length === 0
                        ? 'No activity yet. Start by creating an asset.'
                        : 'No audit logs match your search.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredLogs.length} of {assetManager.auditLogs.length} entries</span>
            <span>Last updated: Just now</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
