
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
  Search, 
  Bell, 
  Settings, 
  Flag,
  FileText
} from 'lucide-react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Search },
  { title: 'Scan Email', url: '/scan', icon: Search },
  { title: 'Suspicious Inbox', url: '/inbox', icon: Flag },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Threat Insights', url: '/insights', icon: Bell },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${collapsed ? 'w-14' : 'w-64'} transition-all duration-300 border-r border-border/50 bg-sidebar/95 backdrop-blur-sm`}
      collapsible
    >
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-green rounded-lg flex items-center justify-center cyber-pulse">
              <Search className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">PhishGuard</h1>
                <p className="text-xs text-muted-foreground">AI Security</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-muted-foreground">
            {!collapsed && 'Security Center'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary/20 text-primary border-l-2 border-primary cyber-glow'
                            : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
