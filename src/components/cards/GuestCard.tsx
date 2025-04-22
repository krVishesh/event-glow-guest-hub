
import React, { useState } from "react";
import { formatTimeAgo } from "@/lib/mock-data";
import { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import { MapPin, CircleCheck, Save } from "lucide-react";

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
  
  // Get the assigned volunteers - make sure assignedVolunteers exists and is an array
  const volunteers = (localGuest.assignedVolunteers || []).map(id => 
    users.find(u => u.id === id)
  ).filter(Boolean);
  
  // Get the assigned dorm
  const dorm = localGuest.dormId ? dorms.find(d => d.id === localGuest.dormId) : null;
  
  // Get recent updates
  const updates = getUpdatesForEntity(localGuest.id).slice(0, 2);

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
      className="card-shadow card-hover overflow-hidden"
      onClick={!editable ? onClick : undefined}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className={`h-2 w-full ${getGuestTypeBadgeClass(localGuest.type)}`}></div>
          
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{localGuest.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className={getGuestTypeBadgeClass(localGuest.type)}>
                    {localGuest.type}
                  </Badge>
                  
                  <Badge variant="outline">
                    {localGuest.status}
                  </Badge>
                </div>
              </div>
              
              {localGuest.groupSize > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Group of {localGuest.groupSize}
                </Badge>
              )}
            </div>
            
            {localGuest.location && (
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{localGuest.location}</span>
              </div>
            )}
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Dorm:</span>
                <span className="font-medium">
                  {dorm ? dorm.name : "Not Assigned"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Volunteers:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {volunteers.length > 0 ? (
                    volunteers.map(volunteer => (
                      <Badge key={volunteer?.id} variant="outline" className="text-xs">
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
            
            {editable && hasChanges && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
            
            {updates.length > 0 && (
              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                <h4 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recent Activity</h4>
                <div className="space-y-2">
                  {updates.map(update => (
                    <div key={update.id} className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs">
                      <span className="font-medium">{update.updateType}</span>
                      <span className="text-gray-500 dark:text-gray-400"> by {update.updatedByName} • {formatTimeAgo(update.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-right text-xs text-gray-400 dark:text-gray-500">
              Last updated {formatTimeAgo(localGuest.lastUpdated)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
