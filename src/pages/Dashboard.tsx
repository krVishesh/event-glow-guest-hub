
import React from "react";
import { useApp } from "@/lib/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestCard } from "@/components/cards/GuestCard";
import { DormCard } from "@/components/cards/DormCard";

const Dashboard: React.FC = () => {
  const { guests, dorms, currentUser } = useApp();
  
  // Filter guests based on current user role
  const filteredGuests = currentUser?.role === 'Volunteer' 
    ? guests.filter(g => g.assignedVolunteerId === currentUser.id)
    : guests;
  
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
            <p className="text-xs text-muted-foreground">
              ({Math.round((checkedInGuests / totalGuests) * 100) || 0}% of total)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Arrival
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGuests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Beds Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds - occupiedBeds}</div>
            <p className="text-xs text-muted-foreground">
              of {totalBeds} total ({Math.round(((totalBeds - occupiedBeds) / totalBeds) * 100) || 0}%)
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Guest Activity</h2>
            <a href="/guests" className="text-sm text-primary-400 hover:underline">
              View all
            </a>
          </div>
          
          <div className="space-y-4">
            {recentGuests.map(guest => (
              <GuestCard key={guest.id} guest={guest} />
            ))}
            
            {recentGuests.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No recent guest activity
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Dorms</h2>
            <a href="/dorms" className="text-sm text-primary-400 hover:underline">
              View all
            </a>
          </div>
          
          <div className="space-y-4">
            {availableDorms.map(dorm => (
              <DormCard key={dorm.id} dorm={dorm} />
            ))}
            
            {availableDorms.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No dorms available
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
