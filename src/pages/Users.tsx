
import React from "react";
import { useApp } from "@/lib/app-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/mock-data";

const UsersPage: React.FC = () => {
  const { users } = useApp();
  
  // Group users by role
  const groupedUsers = {
    Manager: users.filter(user => user.role === 'Manager'),
    Coordinator: users.filter(user => user.role === 'Coordinator'),
    Desk: users.filter(user => user.role === 'Desk'),
    Volunteer: users.filter(user => user.role === 'Volunteer')
  };
  
  // Helper to get role badge color
  const getRoleBadgeClass = (role: string) => {
    switch(role) {
      case 'Manager': return 'bg-purple-100 text-purple-800';
      case 'Coordinator': return 'bg-blue-100 text-blue-800';
      case 'Desk': return 'bg-green-100 text-green-800';
      case 'Volunteer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          View all users in the system and their activity status.
        </p>
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedUsers).map(([role, users]) => (
          <div key={role} className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Badge className={getRoleBadgeClass(role)}>
                {role}
              </Badge>
              <span>Users</span>
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {users.map(user => (
                <Card key={user.id} className="card-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className="flex h-3 w-3 items-center">
                        <span 
                          className={`relative flex h-3 w-3 ${user.isActive ? 'animate-pulse-light' : ''}`}
                        >
                          <span 
                            className={`absolute inline-flex h-full w-full rounded-full ${user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}
                          ></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      Last active: {formatTimeAgo(user.lastActive)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
