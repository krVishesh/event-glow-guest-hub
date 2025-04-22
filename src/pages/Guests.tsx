
import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { GuestCard } from "@/components/cards/GuestCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GuestType, GuestStatus, User, Guest } from "@/lib/types";

const GuestsPage: React.FC = () => {
  const { filteredGuests, guestFilters, setGuestFilters, users, dorms, updateGuest } = useApp();
  
  // State for guest detail dialog
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
  
  // Handle guest status change
  const handleStatusChange = (guest: Guest, newStatus: GuestStatus) => {
    updateGuest({
      ...guest,
      status: newStatus
    });
  };
  
  // Handle volunteer assignment change
  const handleVolunteerChange = (guest: Guest, volunteerId: string) => {
    // Check if volunteer is already assigned
    const volunteerIndex = guest.assignedVolunteers.indexOf(volunteerId);
    let updatedVolunteers: string[];
    
    if (volunteerIndex >= 0) {
      // Remove volunteer if already assigned
      updatedVolunteers = [...guest.assignedVolunteers];
      updatedVolunteers.splice(volunteerIndex, 1);
    } else {
      // Add volunteer if not assigned
      updatedVolunteers = [...guest.assignedVolunteers, volunteerId];
    }
    
    updateGuest({
      ...guest,
      assignedVolunteers: updatedVolunteers
    });
  };
  
  // Handle dorm assignment change
  const handleDormChange = (guest: Guest, newDormId: string | null) => {
    updateGuest({
      ...guest,
      dormId: newDormId
    });
  };
  
  // Handle payment status change
  const handlePaymentChange = (guest: Guest, newPaymentStatus: 'Paid' | 'Pending' | 'NA') => {
    updateGuest({
      ...guest,
      paymentStatus: newPaymentStatus
    });
  };
  
  // Open guest detail dialog
  const openGuestDetail = (guest: Guest) => {
    setSelectedGuest(guest);
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

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Guest Management</h1>
        <p className="text-muted-foreground">
          Manage guests, assign dorms, and track status.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 md:max-w-sm">
          <Input
            placeholder="Search guests..."
            value={guestFilters.search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={guestFilters.type.length === 0 ? "bg-primary-100" : ""}
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedGuest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                  {selectedGuest.name}
                  <Badge className={getGuestTypeBadgeClass(selectedGuest.type)}>
                    {selectedGuest.type}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Guest Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {guestStatuses.map(status => (
                        <Button
                          key={status}
                          variant={selectedGuest.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(selectedGuest, status)}
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
                        variant={selectedGuest.paymentStatus === 'Paid' ? "default" : "outline"}
                        size="sm"
                        className={selectedGuest.paymentStatus === 'Paid' ? "bg-green-600" : ""}
                        onClick={() => handlePaymentChange(selectedGuest, 'Paid')}
                      >
                        Paid
                      </Button>
                      <Button
                        variant={selectedGuest.paymentStatus === 'Pending' ? "default" : "outline"}
                        size="sm"
                        className={selectedGuest.paymentStatus === 'Pending' ? "bg-yellow-600" : ""}
                        onClick={() => handlePaymentChange(selectedGuest, 'Pending')}
                      >
                        Pending
                      </Button>
                      <Button
                        variant={selectedGuest.paymentStatus === 'NA' ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePaymentChange(selectedGuest, 'NA')}
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
                            variant={selectedGuest.assignedVolunteers.includes(volunteer.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleVolunteerChange(selectedGuest, volunteer.id)}
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
                        variant={selectedGuest.dormId === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDormChange(selectedGuest, null)}
                      >
                        No Dorm
                      </Button>
                      
                      {dorms
                        .filter(dorm => dorm.occupiedBeds < dorm.capacity || dorm.guests.includes(selectedGuest.id))
                        .map(dorm => (
                          <Button
                            key={dorm.id}
                            variant={selectedGuest.dormId === dorm.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleDormChange(selectedGuest, dorm.id)}
                          >
                            {dorm.name} ({dorm.occupiedBeds}/{dorm.capacity})
                          </Button>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-2 font-medium">Group Size</h3>
                    <div className="text-lg font-medium">
                      {selectedGuest.groupSize} {selectedGuest.groupSize === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-2 font-medium">Check-in / Check-out</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span className="font-medium">
                          {selectedGuest.checkInTime ? new Date(selectedGuest.checkInTime).toLocaleString() : 'Not checked in'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span className="font-medium">
                          {selectedGuest.checkOutTime ? new Date(selectedGuest.checkOutTime).toLocaleString() : 'Not checked out'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestsPage;
