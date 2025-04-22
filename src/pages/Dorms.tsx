import React, { useState } from "react";
import { useApp } from "@/lib/app-context";
import { DormCard } from "@/components/cards/DormCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dorm, Guest } from "@/lib/types";
import { formatTimeAgo } from "@/lib/mock-data";

const DormsPage: React.FC = () => {
  const { 
    filteredDorms, 
    dormFilters, 
    setDormFilters,
    currentUser,
    canPerformAction,
    guests, 
    updateDorm
  } = useApp();
  
  // State for dorm detail dialog
  const [selectedDorm, setSelectedDorm] = useState<Dorm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDormFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  // Handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setDormFilters((prev) => {
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
  
  // Open dorm detail dialog
  const openDormDetail = (dorm: Dorm) => {
    setSelectedDorm(dorm);
    setDialogOpen(true);
  };
  
  // Get dorm assigned guests 
  const getDormGuests = (dormId: string) => {
    return guests.filter(guest => guest.dormId === dormId);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dorm Management</h1>
          <p className="text-muted-foreground">
            Manage dorms and track occupancy in real-time.
          </p>
        </div>
        
        {currentUser && ['Manager', 'Coordinator', 'Desk'].includes(currentUser.role) && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Dorm
          </Button>
        )}
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1 md:max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dorms..."
              value={dormFilters.search}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDormFilters(prev => ({...prev, search: ''}))}
            title="Reset search"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className={dormFilters.availability.length === 0 ? "bg-primary-100" : ""}
            onClick={() => setDormFilters(prev => ({ ...prev, availability: [] }))}
          >
            All Dorms
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={dormFilters.availability.includes('Available') ? "bg-green-100 text-green-700" : ""}
            onClick={() => handleFilterChange('availability', 'Available')}
          >
            Available
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={dormFilters.availability.includes('Full') ? "bg-red-100 text-red-700" : ""}
            onClick={() => handleFilterChange('availability', 'Full')}
          >
            Full
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Dorms</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="full">Full</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDorms.length > 0 ? (
              filteredDorms.map(dorm => (
                <DormCard 
                  key={dorm.id} 
                  dorm={dorm} 
                  onClick={() => openDormDetail(dorm)}
                />
              ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No dorms found matching the current filters.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDorms.filter(d => d.occupiedBeds < d.capacity).length > 0 ? (
              filteredDorms
                .filter(d => d.occupiedBeds < d.capacity)
                .map(dorm => (
                  <DormCard 
                    key={dorm.id} 
                    dorm={dorm} 
                    onClick={() => openDormDetail(dorm)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No available dorms found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="full" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDorms.filter(d => d.occupiedBeds >= d.capacity).length > 0 ? (
              filteredDorms
                .filter(d => d.occupiedBeds >= d.capacity)
                .map(dorm => (
                  <DormCard 
                    key={dorm.id} 
                    dorm={dorm} 
                    onClick={() => openDormDetail(dorm)}
                  />
                ))
            ) : (
              <div className="col-span-full mt-8 text-center text-muted-foreground">
                No full dorms found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dorm Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
          {selectedDorm && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                  {selectedDorm.name}
                  <Badge 
                    variant={selectedDorm.occupiedBeds >= selectedDorm.capacity ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {selectedDorm.occupiedBeds >= selectedDorm.capacity ? "Full" : "Available"}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 overflow-y-auto pr-2">
                <div className="grid gap-4 rounded-md border border-border bg-gray-50 p-4 sm:grid-cols-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total Capacity</div>
                    <div className="text-2xl font-bold">{selectedDorm.capacity}</div>
                    <div className="text-xs text-muted-foreground">beds</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Occupied</div>
                    <div className="text-2xl font-bold">{selectedDorm.occupiedBeds}</div>
                    <div className="text-xs text-muted-foreground">beds</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Available</div>
                    <div className="text-2xl font-bold">{selectedDorm.capacity - selectedDorm.occupiedBeds}</div>
                    <div className="text-xs text-muted-foreground">beds</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-3 text-lg font-medium">Assigned Guests</h3>
                  {getDormGuests(selectedDorm.id).length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {getDormGuests(selectedDorm.id).map(guest => (
                        <GuestCard key={guest.id} guest={guest} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border p-4 text-center text-muted-foreground">
                      No guests assigned to this dorm.
                    </div>
                  )}
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-sm font-medium">Dorm Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{formatTimeAgo(selectedDorm.lastUpdated)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Occupancy Rate:</span>
                      <span className="font-medium">
                        {Math.round((selectedDorm.occupiedBeds / selectedDorm.capacity) * 100)}%
                      </span>
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

export default DormsPage;
