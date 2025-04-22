import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { GuestCard } from "@/components/cards/GuestCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GuestType, GuestStatus, User, Guest } from "@/lib/types";
import { Plus, Search, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const GuestsPage: React.FC = () => {
  const { 
    filteredGuests, 
    guestFilters, 
    setGuestFilters, 
    currentUser,
    canPerformAction,
    users, dorms, updateGuest
  } = useApp();
  
  // State for guest detail dialog
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editedGuest, setEditedGuest] = useState<Guest | null>(null);
  
  // Guest type and status options
  const guestTypes: GuestType[] = ['Special', 'Foreign', 'Normal', 'Events', 'Workers', 'VITians'];
  const guestStatuses: GuestStatus[] = ['Registered', 'Checked-in', 'Checked-out', 'No-show', 'Cancelled'];
  
  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setGuestFilters((prev) => {
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
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setGuestFilters({
      search: '',
      type: [],
      status: [],
      dorm: [],
      volunteer: []
    });
  };
  
  // Handle guest status change
  const handleStatusChange = (guest: Guest, newStatus: GuestStatus) => {
    setEditedGuest(prev => {
      if (!prev) return { ...guest, status: newStatus };
      return { ...prev, status: newStatus };
    });
  };
  
  // Handle volunteer assignment change
  const handleVolunteerChange = (guest: Guest, volunteerId: string) => {
    // Check if volunteer is already assigned
    const volunteerIndex = (guest.assignedVolunteers || []).indexOf(volunteerId);
    let updatedVolunteers: string[];
    
    if (volunteerIndex >= 0) {
      // Remove volunteer if already assigned
      updatedVolunteers = [...(guest.assignedVolunteers || [])];
      updatedVolunteers.splice(volunteerIndex, 1);
    } else {
      // Add volunteer if not assigned
      updatedVolunteers = [...(guest.assignedVolunteers || []), volunteerId];
    }
    
    setEditedGuest(prev => {
      if (!prev) return { ...guest, assignedVolunteers: updatedVolunteers };
      return { ...prev, assignedVolunteers: updatedVolunteers };
    });
  };
  
  // Handle dorm assignment change
  const handleDormChange = (guest: Guest, newDormId: string | null) => {
    setEditedGuest(prev => {
      if (!prev) return { ...guest, dormId: newDormId };
      return { ...prev, dormId: newDormId };
    });
  };
  
  // Handle payment status change
  const handlePaymentChange = (guest: Guest, newPaymentStatus: 'Paid' | 'Pending' | 'NA') => {
    setEditedGuest(prev => {
      if (!prev) return { ...guest, paymentStatus: newPaymentStatus };
      return { ...prev, paymentStatus: newPaymentStatus };
    });
  };
  
  // Save changes to the guest
  const saveGuestChanges = () => {
    if (editedGuest) {
      updateGuest(editedGuest);
      setEditedGuest(null);
      setDialogOpen(false); // Close dialog after saving
    }
  };
  
  // Open guest detail dialog
  const openGuestDetail = (guest: Guest) => {
    setSelectedGuest(guest);
    setEditedGuest(guest); // Initialize with the current guest data
    setDialogOpen(true);
  };

  // Get guest type badge class
  const getGuestTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'Special': return 'badge-special';
      case 'Foreign': return 'badge-foreign';
      case 'Normal': return 'badge-normal';
      case 'Events': return 'badge-events';
      case 'Workers': return 'badge-workers';
      case 'VITians': return 'badge-vitians';
      default: return '';
    }
  };

  
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guest Management</h1>
          <p className="text-muted-foreground">
            Manage guests, assign dorms, and track status.
          </p>
        </div>
        
        {currentUser && ['Manager', 'Coordinator', 'Desk'].includes(currentUser.role) && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Guest
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1 md:max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              value={guestFilters.search}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={resetFilters}
            title="Reset all filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={guestFilters.type.length === 0 ? "bg-primary-100 dark:bg-primary-900" : ""}
            onClick={() => setGuestFilters(prev => ({ ...prev, type: [] }))}
          >
            All Types
          </Button>
          
          {guestTypes.map(type => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className={guestFilters.type.includes(type) ? getGuestTypeBadgeClass(type) : ""}
              onClick={() => handleFilterChange('type', type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
          <TabsTrigger value="checked-in">Checked In</TabsTrigger>
          <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.length > 0 ? (
              filteredGuests.map(guest => (
                <GuestCard 
                  key={guest.id} 
                  guest={guest} 
                  onClick={() => openGuestDetail(guest)}
                />
              ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No guests found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="registered" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.filter(g => g.status === 'Registered').length > 0 ? (
              filteredGuests
                .filter(g => g.status === 'Registered')
                .map(guest => (
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    onClick={() => openGuestDetail(guest)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No registered guests found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="checked-in" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.filter(g => g.status === 'Checked-in').length > 0 ? (
              filteredGuests
                .filter(g => g.status === 'Checked-in')
                .map(guest => (
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    onClick={() => openGuestDetail(guest)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No checked-in guests found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="checked-out" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.filter(g => g.status === 'Checked-out').length > 0 ? (
              filteredGuests
                .filter(g => g.status === 'Checked-out')
                .map(guest => (
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    onClick={() => openGuestDetail(guest)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No checked-out guests found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="other" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuests.filter(g => g.status === 'No-show' || g.status === 'Cancelled').length > 0 ? (
              filteredGuests
                .filter(g => g.status === 'No-show' || g.status === 'Cancelled')
                .map(guest => (
                  <GuestCard 
                    key={guest.id} 
                    guest={guest} 
                    onClick={() => openGuestDetail(guest)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No guests with No-show or Cancelled status found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Guest Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          {selectedGuest && editedGuest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                  {selectedGuest.name}
                  <Badge className={getGuestTypeBadgeClass(selectedGuest.type)}>
                    {selectedGuest.type}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Guest Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {guestStatuses.map(status => (
                          <Button
                            key={status}
                            variant={editedGuest.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleStatusChange(editedGuest, status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Payment Status</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={editedGuest.paymentStatus === 'Paid' ? "default" : "outline"}
                          size="sm"
                          className={editedGuest.paymentStatus === 'Paid' ? "bg-green-600" : ""}
                          onClick={() => handlePaymentChange(editedGuest, 'Paid')}
                        >
                          Paid
                        </Button>
                        <Button
                          variant={editedGuest.paymentStatus === 'Pending' ? "default" : "outline"}
                          size="sm"
                          className={editedGuest.paymentStatus === 'Pending' ? "bg-yellow-600" : ""}
                          onClick={() => handlePaymentChange(editedGuest, 'Pending')}
                        >
                          Pending
                        </Button>
                        <Button
                          variant={editedGuest.paymentStatus === 'NA' ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePaymentChange(editedGuest, 'NA')}
                        >
                          Not Applicable
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Assigned Volunteers</h3>
                      <div className="flex flex-wrap gap-2">
                        {users
                          .filter(user => user.role === 'Volunteer')
                          .map(volunteer => (
                            <Button
                              key={volunteer.id}
                              variant={(editedGuest.assignedVolunteers || []).includes(volunteer.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleVolunteerChange(editedGuest, volunteer.id)}
                            >
                              {volunteer.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Dorm Assignment</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={editedGuest.dormId === null ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDormChange(editedGuest, null)}
                        >
                          No Dorm
                        </Button>
                        
                        {dorms
                          .filter(dorm => dorm.occupiedBeds < dorm.capacity || dorm.id === editedGuest.dormId)
                          .map(dorm => (
                            <Button
                              key={dorm.id}
                              variant={editedGuest.dormId === dorm.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleDormChange(editedGuest, dorm.id)}
                            >
                              {dorm.name} ({dorm.occupiedBeds}/{dorm.capacity})
                            </Button>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Group Size</h3>
                      <div className="text-lg font-medium">
                        {editedGuest.groupSize} {editedGuest.groupSize === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Check-in / Check-out</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-in:</span>
                          <span className="font-medium">
                            {editedGuest.checkInTime ? new Date(editedGuest.checkInTime).toLocaleString() : 'Not checked in'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Check-out:</span>
                          <span className="font-medium">
                            {editedGuest.checkOutTime ? new Date(editedGuest.checkOutTime).toLocaleString() : 'Not checked out'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={saveGuestChanges}
                  disabled={JSON.stringify(selectedGuest) === JSON.stringify(editedGuest)}
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestsPage;
