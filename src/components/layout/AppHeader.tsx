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
import { useNavigate } from "react-router-dom";

export const AppHeader: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();
  const navigate = useNavigate();
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
    setCurrentUser(null);
    setShowUserDialog(false);
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="live-indicator">
                  <span>Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
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
          
          <div className="h-8 w-px bg-border" />
          
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setShowUserDialog(true)}
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900">
              <span className="font-medium text-primary-700 dark:text-primary-300">
                {currentUser?.name.charAt(0) || "U"}
              </span>
            </span>
            <span className="hidden md:inline-block">{currentUser?.name}</span>
          </Button>
        </div>
      </div>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                <User className="h-6 w-6 text-primary-700 dark:text-primary-300" />
              </div>
              <div>
                <h3 className="font-medium">{currentUser?.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser?.role}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
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
