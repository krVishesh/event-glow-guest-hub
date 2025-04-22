
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dorm, Guest } from "@/lib/types";
import { formatTimeAgo } from "@/lib/mock-data";
import { useApp } from "@/lib/app-context";

interface DormCardProps {
  dorm: Dorm;
  onClick?: () => void;
}

export const DormCard: React.FC<DormCardProps> = ({ dorm, onClick }) => {
  const { guests, users, getUpdatesForEntity } = useApp();
  
  // Get assigned guests
  const assignedGuests = guests.filter(g => dorm.guests.includes(g.id));
  
  // Get last updated by user
  const lastUpdatedBy = users.find(u => u.id === dorm.lastUpdatedBy);
  
  // Get recent updates
  const updates = getUpdatesForEntity(dorm.id).slice(0, 2);
  
  // Calculate occupancy percentage
  const occupancyPercentage = Math.round((dorm.occupiedBeds / dorm.capacity) * 100);
  
  // Determine status color
  const getStatusColor = () => {
    if (occupancyPercentage >= 100) return "bg-red-500";
    if (occupancyPercentage >= 75) return "bg-orange-400";
    if (occupancyPercentage >= 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <Card 
      className="card-shadow card-hover overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-64 overflow-hidden">
          {/* Status bar based on occupancy */}
          <div className="sticky top-0 z-10 h-2 w-full bg-gray-200">
            <div 
              className={`h-full ${getStatusColor()}`} 
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
          
          <div className="p-5 h-full overflow-y-auto">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{dorm.name}</h3>
              </div>
              
              <Badge 
                variant={dorm.occupiedBeds >= dorm.capacity ? "destructive" : "secondary"}
                className="text-xs"
              >
                {dorm.occupiedBeds >= dorm.capacity ? "Full" : "Available"}
              </Badge>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Capacity:</span>
                <span className="font-medium">
                  <span className={dorm.occupiedBeds >= dorm.capacity ? "text-red-600" : "text-green-600"}>
                    {dorm.occupiedBeds}
                  </span>
                  /{dorm.capacity} beds
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Empty beds:</span>
                <span className="font-medium">
                  {dorm.capacity - dorm.occupiedBeds}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Guest types:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {Array.from(new Set(assignedGuests.map(g => g.type))).map(type => (
                    <Badge key={type} className={`badge-${type.toLowerCase()} text-xs`}>
                      {type}
                    </Badge>
                  ))}
                  {assignedGuests.length === 0 && <span className="text-gray-400">None</span>}
                </div>
              </div>
            </div>
            
            {assignedGuests.length > 0 && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <h4 className="mb-2 text-xs font-medium text-gray-500">Assigned Guests</h4>
                <div className="space-y-1">
                  {assignedGuests.slice(0, 3).map(guest => (
                    <div key={guest.id} className="rounded-md bg-gray-50 px-2 py-1 text-xs">
                      {guest.name}
                      <Badge className={`badge-${guest.type.toLowerCase()} ml-2 text-xs`}>
                        {guest.type}
                      </Badge>
                    </div>
                  ))}
                  {assignedGuests.length > 3 && (
                    <div className="text-right text-xs text-gray-500">
                      + {assignedGuests.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-right text-xs text-gray-400">
              Last updated by {lastUpdatedBy?.name || "Unknown"} • {formatTimeAgo(dorm.lastUpdated)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
