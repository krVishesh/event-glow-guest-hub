
import React from "react";
import { formatTimeAgo } from "@/lib/mock-data";
import { Guest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import { MapPin, CircleCheck } from "lucide-react";

interface GuestCardProps {
  guest: Guest;
  onClick?: () => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ guest, onClick }) => {
  const { users, dorms, getUpdatesForEntity, currentUser } = useApp();
  
  // Get the assigned volunteers
  const volunteers = guest.assignedVolunteers.map(id => 
    users.find(u => u.id === id)
  ).filter(Boolean);
  
  // Get the assigned dorm
  const dorm = guest.dormId ? dorms.find(d => d.id === guest.dormId) : null;
  
  // Get recent updates
  const updates = getUpdatesForEntity(guest.id).slice(0, 2);

  // Get guest type badge class
  const getGuestTypeBadgeClass = (type: string) => {
    switch(type) {
      case 'Special': return 'bg-purple-100 text-purple-800';
      case 'Foreign': return 'bg-blue-100 text-blue-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Events': return 'bg-yellow-100 text-yellow-800';
      case 'Workers': return 'bg-orange-100 text-orange-800';
      case 'VITians': return 'bg-pink-100 text-pink-800';
      default: return '';
    }
  };

  return (
    <Card 
      className="card-shadow card-hover overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className={`h-2 w-full ${getGuestTypeBadgeClass(guest.type)}`}></div>
          
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{guest.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge className={getGuestTypeBadgeClass(guest.type)}>
                    {guest.type}
                  </Badge>
                  
                  <Badge variant="outline">
                    {guest.status}
                  </Badge>
                </div>
              </div>
              
              {guest.groupSize > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Group of {guest.groupSize}
                </Badge>
              )}
            </div>
            
            {guest.location && (
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{guest.location}</span>
              </div>
            )}
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Dorm:</span>
                <span className="font-medium">
                  {dorm ? dorm.name : "Not Assigned"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Volunteers:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {volunteers.length > 0 ? (
                    volunteers.map(volunteer => (
                      <Badge key={volunteer?.id} variant="outline" className="text-xs">
                        {volunteer?.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment:</span>
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    guest.paymentStatus === 'Paid' 
                      ? 'bg-green-100 text-green-700' 
                      : guest.paymentStatus === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {guest.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {updates.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <h4 className="mb-2 text-xs font-medium text-gray-500">Recent Activity</h4>
                <div className="space-y-2">
                  {updates.map(update => (
                    <div key={update.id} className="rounded-md bg-gray-50 px-2 py-1 text-xs">
                      <span className="font-medium">{update.updateType}</span>
                      <span className="text-gray-500"> by {update.updatedByName} • {formatTimeAgo(update.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-right text-xs text-gray-400">
              Last updated {formatTimeAgo(guest.lastUpdated)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
