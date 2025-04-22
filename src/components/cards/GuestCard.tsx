import React, { useState, useEffect } from "react";
import { formatTimeAgo } from "@/lib/mock-data";
import { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import { MapPin, CircleCheck, Save, Clock } from "lucide-react";

interface GuestCardProps {
  guest: Guest;
  onClick?: () => void;
  editable?: boolean;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onClick, editable = false }) => {
  const { users, dorms, getUpdatesForEntity, currentUser, updateGuest } = useApp();
  
  // Local state for tracking changes
  const [localGuest, setLocalGuest] = useState<Guest>(guest);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Update localGuest when guest prop changes
  useEffect(() => {
    setLocalGuest(guest);
    setHasChanges(false);
  }, [guest]);
  
  // Get the assigned volunteers - make sure assignedVolunteers exists and is an array
  const volunteers = (localGuest.assignedVolunteers || []).map(id => 
    users.find(u => u.id === id)
  ).filter(Boolean);
  
  // Get the assigned dorm
  const dorm = localGuest.dormId ? dorms.find(d => d.id === localGuest.dormId) : null;
  
  // Get recent updates
  const updates = getUpdatesForEntity(localGuest.id).slice(0, 2);

  // Get the user who last updated the guest
  const lastUpdatedByUser = users.find(u => u.id === localGuest.lastUpdatedBy);

  // Get guest type badge class
  const getGuestTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'Special': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Foreign': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Normal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Events': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Workers': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'VITians': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return '';
    }
  };
  
  // Handle saving changes
  const handleSaveChanges = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of parent card
    updateGuest(localGuest);
    setHasChanges(false);
  };
  
  // Update local state with changes
  const updateLocalGuest = (updates: Partial<Guest>) => {
    setLocalGuest(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  return (
    <Card 
      className="card-shadow card-hover dark:bg-gray-900 dark:border-gray-800"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Status bar based on guest status */}
          <div className="sticky top-0 z-10 h-2 w-full bg-gray-200 dark:bg-gray-700">
            <div 
              className={`h-full ${
                localGuest.status === 'Checked-in' 
                  ? 'bg-green-500 dark:bg-green-600' 
                  : localGuest.status === 'Checked-out'
                    ? 'bg-red-500 dark:bg-red-600'
                    : 'bg-yellow-400 dark:bg-yellow-500'
              }`} 
              style={{ width: '100%' }}
            ></div>
          </div>
          
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">{localGuest.name}</h3>
                <Badge className={getGuestTypeBadgeClass(localGuest.type)}>
                  {localGuest.type}
                </Badge>
              </div>
              
              <Badge 
                variant={
                  localGuest.status === 'Checked-in' 
                    ? 'default' 
                    : localGuest.status === 'Checked-out'
                      ? 'destructive'
                      : 'secondary'
                }
                className="text-xs"
              >
                {localGuest.status}
              </Badge>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Group Size:</span>
                <span className="font-medium dark:text-white">
                  {localGuest.groupSize} {localGuest.groupSize === 1 ? 'person' : 'people'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Dorm:</span>
                <span className="font-medium dark:text-white">
                  {dorm ? dorm.name : "Not Assigned"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Volunteers:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {volunteers.length > 0 ? (
                    volunteers.map(volunteer => (
                      <Badge key={volunteer?.id} variant="outline" className="text-xs dark:border-gray-700 dark:text-gray-300">
                        {volunteer?.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">Unassigned</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    localGuest.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                      : localGuest.paymentStatus === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {localGuest.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {updates.length > 0 && (
              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                <h4 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recent Updates</h4>
                <div className="space-y-1">
                  {updates.map(update => (
                    <div key={update.id} className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs dark:text-gray-300">
                      {update.updateType}: {update.newValue}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(localGuest.lastUpdated)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Updated by</span>
                <span className="font-medium dark:text-gray-300">
                  {lastUpdatedByUser?.name || "Unknown"}
                </span>
              </div>
            </div>
            
            {editable && hasChanges && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
