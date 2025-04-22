import React from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="fixed inset-y-0 z-50 hidden w-64 border-r bg-background lg:block">
        <AppSidebar />
      </div>
      <div className="flex-1 lg:pl-64">
        <div className="sticky top-0 z-40 w-full border-b bg-background">
          <AppHeader />
        </div>
        <main className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
