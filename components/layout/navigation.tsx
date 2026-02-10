'use client';

import { Package, BarChart3, Laptop, Smartphone, Zap, History, FileUp, Upload, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'assets', label: 'Assets Master', icon: Package },
    { id: 'create', label: 'Create Asset', icon: Zap },
    { id: 'allocate', label: 'Allocations', icon: Smartphone },
    { id: 'transfer', label: 'Transfers', icon: Laptop },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'import', label: 'Bulk Import', icon: Upload },
    { id: 'reports', label: 'Reports', icon: FileUp },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col h-screen`}>
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Assets</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent h-9 w-9 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className={`text-xs text-sidebar-foreground opacity-70 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? 'v1.0.0' : 'v1'}
        </div>
      </div>
    </aside>
  );
}
