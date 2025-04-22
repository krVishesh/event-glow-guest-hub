import React, { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestCard } from "@/components/cards/GuestCard";
import { DormCard } from "@/components/cards/DormCard";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { guests, dorms, currentUser } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  console.log('Dashboard render:', { 
    currentUser, 
    guestsCount: guests?.length, 
    dormsCount: dorms?.length,
    isLoading,
    error 
  });
  
  // Redirect to login if no user
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }
  
  try {
    // Filter guests based on current user role
    const filteredGuests = currentUser?.role === 'Volunteer' 
      ? guests.filter(g => g.assignedVolunteers && g.assignedVolunteers.includes(currentUser.id))
      : guests;
    
    console.log('Filtered guests:', filteredGuests.length);
    
    // Get counts for stats
    const totalGuests = filteredGuests.length;
    const checkedInGuests = filteredGuests.filter(g => g.status === 'Checked-in').length;
    const pendingGuests = filteredGuests.filter(g => g.status === 'Registered').length;
    
    // Dorm stats
    const totalBeds = dorms.reduce((acc, dorm) => acc + dorm.capacity, 0);
    const occupiedBeds = dorms.reduce((acc, dorm) => acc + dorm.occupiedBeds, 0);
    
    // Recent activity: either assigned guests or all guests
    const recentGuests = [...filteredGuests]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 3);
    
    // Available dorms
    const availableDorms = dorms
      .filter(dorm => dorm.occupiedBeds < dorm.capacity)
      .sort((a, b) => (a.capacity - a.occupiedBeds) - (b.capacity - b.occupiedBeds))
      .slice(0, 3);

    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}! Here's an overview of your event's status.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGuests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkedInGuests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingGuests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bed Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedBeds}/{totalBeds}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentGuests.map(guest => (
                <GuestCard key={guest.id} guest={guest} />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Available Dorms</h2>
            <div className="space-y-4">
              {availableDorms.map(dorm => (
                <DormCard key={dorm.id} dorm={dorm} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Dashboard:', error);
    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    return (
      <div className="p-4 text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>Something went wrong. Please try again later.</p>
        <pre className="mt-4 text-sm">{error instanceof Error ? error.message : String(error)}</pre>
      </div>
    );
  }
};

export default Dashboard;
