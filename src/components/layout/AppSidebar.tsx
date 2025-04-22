
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useApp } from "@/lib/app-context";

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useApp();

  // Define navigation items based on user role
  const navItems = [
    {
      title: "Dashboard",
      path: "/",
      allowedRoles: ["Volunteer", "Desk", "Coordinator", "Manager"],
    },
    {
      title: "Guests",
      path: "/guests",
      allowedRoles: ["Volunteer", "Desk", "Coordinator", "Manager"],
    },
    {
      title: "Dorms",
      path: "/dorms",
      allowedRoles: ["Desk", "Coordinator", "Manager"],
    },
    {
      title: "Updates",
      path: "/updates",
      allowedRoles: ["Coordinator", "Manager"],
    },
    {
      title: "Users",
      path: "/users",
      allowedRoles: ["Manager"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(
    (item) => currentUser && item.allowedRoles.includes(currentUser.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center py-4">
        <div className="flex items-center px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-300 text-white">
            <span className="text-lg font-bold">EG</span>
          </div>
          <span className="ml-3 text-lg font-semibold text-primary-600">EventGlow</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <Link to={item.path} className="flex items-center">
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {currentUser && (
          <div className="flex flex-col space-y-1 rounded-md border border-purple-100 bg-purple-50 p-3">
            <span className="text-xs font-medium text-primary-500">Logged in as</span>
            <span className="text-sm font-semibold">{currentUser.name}</span>
            <span className="rounded-full bg-primary-300 px-2 py-0.5 text-xs font-medium text-white">
              {currentUser.role}
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
