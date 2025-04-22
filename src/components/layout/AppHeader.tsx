
import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { LogOut, User, Sun, Moon } from "lucide-react";

export const AppHeader: React.FC = () => {
  const { currentUser } = useApp();
  const [showUserDialog, setShowUserDialog] = React.useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if the user has already chosen a theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme === 'dark' || (!savedTheme && prefersDark);
    }
    return false;
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Apply dark mode class to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };
  
  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
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
          
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode} 
                className="rounded-full"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </div>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            
            <Button
              variant="ghost"
              className="flex items-center rounded-full"
              onClick={() => setShowUserDialog(true)}
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900">
                <span className="font-medium text-primary-700 dark:text-primary-300">
                  {currentUser?.name.charAt(0) || "U"}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <User className="h-6 w-6 text-primary-700 dark:text-primary-300" />
              </div>
              <div>
                <h3 className="font-medium dark:text-white">{currentUser?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.role}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
