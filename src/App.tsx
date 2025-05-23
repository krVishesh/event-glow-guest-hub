import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/lib/app-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import GuestsPage from "./pages/Guests";
import DormsPage from "./pages/Dorms";
import UpdatesPage from "./pages/Updates";
import UsersPage from "./pages/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Root redirect component
const RootRedirect = () => {
  const { currentUser } = useApp();
  return <Navigate to={currentUser ? "/dashboard" : "/login"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="guests" element={<GuestsPage />} />
                <Route path="dorms" element={<DormsPage />} />
                <Route path="updates" element={<UpdatesPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
