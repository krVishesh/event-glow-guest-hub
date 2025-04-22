
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, User } from "lucide-react";

export const AppHeader: React.FC = () => {
  const { currentUser } = useApp();
  const [showUserDialog, setShowUserDialog] = React.useState(false);
  
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };
  
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
              onClick={() => setShowUserDialog(true)}
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

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <User className="h-6 w-6 text-primary-700" />
              </div>
              <div>
                <h3 className="font-medium">{currentUser?.name}</h3>
                <p className="text-sm text-gray-500">{currentUser?.role}</p>
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
