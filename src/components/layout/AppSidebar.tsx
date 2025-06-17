
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ScanSearch, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Settings,
  Shield
} from 'lucide-react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard, category: 'main' },
  { title: 'Scan Email', url: '/scan', icon: ScanSearch, category: 'main' },
  { title: 'Suspicious Inbox', url: '/inbox', icon: AlertTriangle, category: 'threats' },
  { title: 'Reports', url: '/reports', icon: FileText, category: 'analytics' },
  { title: 'Threat Insights', url: '/insights', icon: TrendingUp, category: 'analytics' },
  { title: 'Settings', url: '/settings', icon: Settings, category: 'config' },
];

const categoryLabels = {
  main: 'Security Center',
  threats: 'Threat Management',
  analytics: 'Analytics',
  config: 'Configuration'
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar
      className="border-r border-border/30 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl"
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  PhishGuard
                </h1>
                <p className="text-xs text-muted-foreground">AI Security Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 py-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <SidebarGroup key={category} className="px-4 mb-6">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 mb-3 px-2">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {items.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-11">
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                isActive
                                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-500/30'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                              }`
                            }
                          >
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20' : 'group-hover:bg-accent/30'}`}>
                              <item.icon className="w-4 h-4 flex-shrink-0" />
                            </div>
                            {!isCollapsed && (
                              <span className="font-medium text-sm">{item.title}</span>
                            )}
                            {isActive && !isCollapsed && (
                              <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        {/* Status Indicator */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border/20">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="flex-1">
                <p className="text-xs font-medium text-green-400">System Active</p>
                <p className="text-xs text-muted-foreground">Real-time protection enabled</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
