
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";

export const AppHeader: React.FC = () => {
  const { currentUser } = useApp();
  
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <SidebarTrigger className="mr-2" />
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="live-indicator">
                <span>Live Updates</span>
              </div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-200" />
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="flex items-center rounded-full"
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100">
                <span className="font-medium text-primary-700">
                  {currentUser?.name.charAt(0) || "U"}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
