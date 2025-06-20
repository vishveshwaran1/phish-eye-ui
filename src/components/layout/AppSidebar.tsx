
import React from 'react';
import { Home, Scan, Inbox, FileText, TrendingUp, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';

interface AppSidebarProps {
  userRole?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ userRole = 'user' }) => {
  const menuItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Scan Email', url: '/scan', icon: Scan },
    { title: 'Suspicious Inbox', url: '/inbox', icon: Inbox },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Threat Insights', url: '/insights', icon: TrendingUp },
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PhishGuard AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
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
};
