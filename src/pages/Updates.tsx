
import React from "react";
import { useApp } from "@/lib/app-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimestamp } from "@/lib/mock-data";
import { UserRole, Update } from "@/lib/types";

const UpdatesPage: React.FC = () => {
  const { filteredUpdates, updateFilters, setUpdateFilters, users, getGuestById, getDormById } = useApp();
  
  // Update type options
  const updateTypes = [
    'Guest Status',
    'Dorm Assignment',
    'Volunteer Assignment',
    'Payment Update',
    'Check In',
    'Check Out',
    'Guest Added',
    'Guest Edited',
    'Dorm Added',
    'Dorm Edited'
  ];
  
  // Role options
  const roles: UserRole[] = ['Volunteer', 'Desk', 'Coordinator', 'Manager'];
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setUpdateFilters((prev) => {
      const currentFilters = [...prev[filterType]];
      
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [filterType]: currentFilters.filter(f => f !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentFilters, value]
        };
      }
    });
  };
  
  // Group updates by day
  const groupByDay = (updates: Update[]) => {
    const grouped: { [key: string]: Update[] } = {};
    
    updates.forEach(update => {
      const date = new Date(update.timestamp);
      const dayKey = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      
      grouped[dayKey].push(update);
    });
    
    return grouped;
  };
  
  const groupedUpdates = groupByDay(filteredUpdates);
  
  // Helper to get entity name
  const getEntityName = (update: Update) => {
    if (update.entityType === 'Guest') {
      const guest = getGuestById(update.entityId);
      return guest ? guest.name : 'Unknown Guest';
    } else {
      const dorm = getDormById(update.entityId);
      return dorm ? dorm.name : 'Unknown Dorm';
    }
  };
  
  // Helper to get update type badge color
  const getUpdateTypeBadgeClass = (type: string) => {
    if (type.includes('Guest')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Dorm')) return 'bg-blue-100 text-blue-700';
    if (type.includes('Status')) return 'bg-green-100 text-green-700';
    if (type.includes('Assignment')) return 'bg-yellow-100 text-yellow-700';
    if (type.includes('Payment')) return 'bg-orange-100 text-orange-700';
    if (type.includes('Check In')) return 'bg-emerald-100 text-emerald-700';
    if (type.includes('Check Out')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };
  
  // Helper to get role badge color
  const getRoleBadgeClass = (role: UserRole) => {
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
        <h1 className="text-2xl font-bold tracking-tight">Updates Tracker</h1>
        <p className="text-muted-foreground">
          Track and monitor all changes to guests and dorms.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 md:max-w-sm">
          <Input
            placeholder="Search updates..."
            value={updateFilters.search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={updateFilters.entity.length === 0 ? "bg-primary-100" : ""}
            onClick={() => setUpdateFilters(prev => ({ ...prev, entity: [] }))}
          >
            All Entities
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={updateFilters.entity.includes('Guest') ? "bg-purple-100 text-purple-700" : ""}
            onClick={() => handleFilterChange('entity', 'Guest')}
          >
            Guests
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={updateFilters.entity.includes('Dorm') ? "bg-blue-100 text-blue-700" : ""}
            onClick={() => handleFilterChange('entity', 'Dorm')}
          >
            Dorms
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filter by Update Type</h3>
        <div className="flex flex-wrap gap-2">
          {updateTypes.map(type => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className={updateFilters.type.includes(type) ? getUpdateTypeBadgeClass(type) : ""}
              onClick={() => handleFilterChange('type', type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filter by User Role</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <Button
              key={role}
              variant="outline"
              size="sm"
              className={updateFilters.user.some(u => users.find(user => user.id === u)?.role === role) ? getRoleBadgeClass(role) : ""}
              onClick={() => {
                // Select/deselect all users with this role
                const usersWithRole = users.filter(u => u.role === role).map(u => u.id);
                
                // Check if all users with this role are already selected
                const allSelected = usersWithRole.every(u => updateFilters.user.includes(u));
                
                if (allSelected) {
                  // Remove all users with this role
                  setUpdateFilters(prev => ({
                    ...prev,
                    user: prev.user.filter(u => !usersWithRole.includes(u))
                  }));
                } else {
                  // Add all users with this role that are not already selected
                  const newUsersToAdd = usersWithRole.filter(u => !updateFilters.user.includes(u));
                  setUpdateFilters(prev => ({
                    ...prev,
                    user: [...prev.user, ...newUsersToAdd]
                  }));
                }
              }}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Updates</TabsTrigger>
          <TabsTrigger value="guest">Guest Updates</TabsTrigger>
          <TabsTrigger value="dorm">Dorm Updates</TabsTrigger>
          <TabsTrigger value="changes">Status Changes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="space-y-6">
            {Object.keys(groupedUpdates).length > 0 ? (
              Object.entries(groupedUpdates).map(([day, updates]) => (
                <div key={day} className="space-y-3">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <div className="space-y-3">
                    {updates.map(update => (
                      <Card key={update.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-l-4 border-l-primary-400 p-4">
                            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getUpdateTypeBadgeClass(update.updateType)}>
                                  {update.updateType}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {update.entityType}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(update.timestamp)}
                              </span>
                            </div>
                            
                            <h4 className="text-md font-semibold">
                              {getEntityName(update)}
                            </h4>
                            
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Changed from </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.oldValue || 'N/A'}
                              </Badge>
                              <span className="text-muted-foreground"> to </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.newValue}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Updated by</span>
                              <Badge className={getRoleBadgeClass(update.updatedByRole)}>
                                {update.updatedByName}
                              </Badge>
                              <span className="text-xs text-muted-foreground">({update.updatedByRole})</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-8 text-center text-muted-foreground">
                No updates found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="guest" className="mt-4">
          <div className="space-y-6">
            {Object.keys(groupByDay(filteredUpdates.filter(u => u.entityType === 'Guest'))).length > 0 ? (
              Object.entries(groupByDay(filteredUpdates.filter(u => u.entityType === 'Guest'))).map(([day, updates]) => (
                <div key={day} className="space-y-3">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <div className="space-y-3">
                    {updates.map(update => (
                      <Card key={update.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-l-4 border-l-purple-400 p-4">
                            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getUpdateTypeBadgeClass(update.updateType)}>
                                  {update.updateType}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(update.timestamp)}
                              </span>
                            </div>
                            
                            <h4 className="text-md font-semibold">
                              {getEntityName(update)}
                            </h4>
                            
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Changed from </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.oldValue || 'N/A'}
                              </Badge>
                              <span className="text-muted-foreground"> to </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.newValue}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Updated by</span>
                              <Badge className={getRoleBadgeClass(update.updatedByRole)}>
                                {update.updatedByName}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-8 text-center text-muted-foreground">
                No guest updates found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="dorm" className="mt-4">
          <div className="space-y-6">
            {Object.keys(groupByDay(filteredUpdates.filter(u => u.entityType === 'Dorm'))).length > 0 ? (
              Object.entries(groupByDay(filteredUpdates.filter(u => u.entityType === 'Dorm'))).map(([day, updates]) => (
                <div key={day} className="space-y-3">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <div className="space-y-3">
                    {updates.map(update => (
                      <Card key={update.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-l-4 border-l-blue-400 p-4">
                            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getUpdateTypeBadgeClass(update.updateType)}>
                                  {update.updateType}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(update.timestamp)}
                              </span>
                            </div>
                            
                            <h4 className="text-md font-semibold">
                              {getEntityName(update)}
                            </h4>
                            
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Changed from </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.oldValue || 'N/A'}
                              </Badge>
                              <span className="text-muted-foreground"> to </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.newValue}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Updated by</span>
                              <Badge className={getRoleBadgeClass(update.updatedByRole)}>
                                {update.updatedByName}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-8 text-center text-muted-foreground">
                No dorm updates found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="changes" className="mt-4">
          <div className="space-y-6">
            {Object.keys(groupByDay(filteredUpdates.filter(u => 
              u.updateType === 'Guest Status' || 
              u.updateType === 'Check In' || 
              u.updateType === 'Check Out'
            ))).length > 0 ? (
              Object.entries(groupByDay(filteredUpdates.filter(u => 
                u.updateType === 'Guest Status' || 
                u.updateType === 'Check In' || 
                u.updateType === 'Check Out'
              ))).map(([day, updates]) => (
                <div key={day} className="space-y-3">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <div className="space-y-3">
                    {updates.map(update => (
                      <Card key={update.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-l-4 border-l-green-400 p-4">
                            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={getUpdateTypeBadgeClass(update.updateType)}>
                                  {update.updateType}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(update.timestamp)}
                              </span>
                            </div>
                            
                            <h4 className="text-md font-semibold">
                              {getEntityName(update)}
                            </h4>
                            
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Changed from </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.oldValue || 'N/A'}
                              </Badge>
                              <span className="text-muted-foreground"> to </span>
                              <Badge variant="outline" className="mx-1 text-xs font-normal">
                                {update.newValue}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Updated by</span>
                              <Badge className={getRoleBadgeClass(update.updatedByRole)}>
                                {update.updatedByName}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-8 text-center text-muted-foreground">
                No status changes found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdatesPage;
