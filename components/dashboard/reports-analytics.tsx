'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';

const assetTypeData = [
  { name: 'Phones', value: 45, percentage: 45 },
  { name: 'Laptops', value: 35, percentage: 35 },
  { name: 'SIM Cards', value: 20, percentage: 20 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899'];

const statusData = [
  { name: 'Active', value: 85 },
  { name: 'In Transit', value: 8 },
  { name: 'Inactive', value: 7 },
];

const monthlyData = [
  { month: 'Jan', allocated: 12, transferred: 3, deactivated: 1 },
  { month: 'Feb', allocated: 15, transferred: 5, deactivated: 2 },
  { month: 'Mar', allocated: 10, transferred: 2, deactivated: 0 },
  { month: 'Apr', allocated: 18, transferred: 7, deactivated: 3 },
  { month: 'May', allocated: 14, transferred: 4, deactivated: 1 },
  { month: 'Jun', allocated: 16, transferred: 6, deactivated: 2 },
];

const costData = [
  { name: 'Phones', cost: 45000 },
  { name: 'Laptops', cost: 87500 },
  { name: 'SIM Cards', cost: 3000 },
];

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Comprehensive asset insights and statistics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">100</div>
            <p className="text-xs text-muted-foreground mt-2">+5 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">85</div>
            <p className="text-xs text-muted-foreground mt-2">85% utilization</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$135.5K</div>
            <p className="text-xs text-muted-foreground mt-2">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8mo</div>
            <p className="text-xs text-muted-foreground mt-2">Average asset age</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Distribution by Type</CardTitle>
            <CardDescription>Breakdown of all assets in inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Status Overview</CardTitle>
            <CardDescription>Current status of all assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <Badge variant="secondary">{item.value}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(item.value / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Asset allocations, transfers, and deactivations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="allocated"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)' }}
                  name="Allocated"
                />
                <Line
                  type="monotone"
                  dataKey="transferred"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent)' }}
                  name="Transferred"
                />
                <Line
                  type="monotone"
                  dataKey="deactivated"
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--destructive)' }}
                  name="Deactivated"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Asset Value by Type */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Value by Type</CardTitle>
            <CardDescription>Total cost investment per asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="cost" fill="var(--primary)" name="Cost" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Notable trends and observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-2 h-full bg-blue-600 dark:bg-blue-400 rounded" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">High Allocation Rate</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                85% of assets are currently allocated to employees. Consider procuring additional inventory if demand increases.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="w-2 h-full bg-amber-600 dark:bg-amber-400 rounded" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Warranty Expiration</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                12 devices will expire warranty in the next 3 months. Plan maintenance budget accordingly.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="w-2 h-full bg-emerald-600 dark:bg-emerald-400 rounded" />
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Asset Growth</h4>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                Added 5 new assets this month with average value of $2,700 each.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
