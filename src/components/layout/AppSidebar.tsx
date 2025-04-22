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
      path: "/dashboard",
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
    <Sidebar className="w-64">
      <SidebarHeader className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-bold">EG</span>
          </div>
          <span className="text-lg font-semibold">EventGlow</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
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
          <div className="flex flex-col gap-1 rounded-md border bg-muted p-3">
            <span className="text-xs font-medium text-muted-foreground">Logged in as</span>
            <span className="text-sm font-semibold">{currentUser.name}</span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              {currentUser.role}
            </span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
