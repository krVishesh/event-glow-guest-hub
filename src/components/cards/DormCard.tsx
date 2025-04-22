import React from "react";
import { formatTimeAgo } from "@/lib/mock-data";
import { Dorm } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";

interface DormCardProps {
  dorm: Dorm;
  onClick?: () => void;
}

export const DormCard: React.FC<DormCardProps> = ({ dorm, onClick }) => {
  const { guests, currentUser } = useApp();
  
  // Get assigned guests
  const assignedGuests = guests.filter(g => g.dormId === dorm.id);
  
  // Calculate occupancy percentage
  const occupancyPercentage = (dorm.occupiedBeds / dorm.capacity) * 100;
  
  // Get status color based on occupancy
  const getStatusColor = () => {
    if (occupancyPercentage >= 90) return 'bg-red-500 dark:bg-red-600';
    if (occupancyPercentage >= 70) return 'bg-yellow-400 dark:bg-yellow-500';
    return 'bg-green-500 dark:bg-green-600';
  };

  return (
    <Card 
      className="card-shadow card-hover dark:bg-gray-900 dark:border-gray-800"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Status bar based on occupancy */}
          <div className="sticky top-0 z-10 h-2 w-full bg-gray-200 dark:bg-gray-700">
            <div 
              className={`h-full ${getStatusColor()}`} 
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
          
          <div className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold dark:text-white">{dorm.name}</h3>
              </div>
              
              <Badge 
                variant={
                  occupancyPercentage >= 90 
                    ? 'destructive' 
                    : occupancyPercentage >= 70
                      ? 'secondary'
                      : 'default'
                }
                className="text-xs"
              >
                {dorm.occupiedBeds}/{dorm.capacity} Beds
              </Badge>
            </div>
            
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Capacity:</span>
                <span className="font-medium dark:text-white">{dorm.capacity} beds</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Occupied:</span>
                <span className="font-medium dark:text-white">{dorm.occupiedBeds} beds</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Available:</span>
                <span className="font-medium dark:text-white">{dorm.capacity - dorm.occupiedBeds} beds</span>
              </div>
            </div>
            
            {assignedGuests.length > 0 && (
              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                <h4 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Assigned Guests</h4>
                <div className="space-y-1">
                  {assignedGuests.slice(0, 3).map(guest => (
                    <div key={guest.id} className="rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs dark:text-gray-300">
                      {guest.name}
                    </div>
                  ))}
                  {assignedGuests.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{assignedGuests.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-right text-xs text-gray-400 dark:text-gray-500">
              Last updated by {dorm.lastUpdatedBy || "Unknown"} • {formatTimeAgo(dorm.lastUpdated)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
