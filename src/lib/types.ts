
// Type definitions for the app

export type UserRole = 'Volunteer' | 'Desk' | 'Coordinator' | 'Manager';

export type GuestType = 'Special' | 'Foreign' | 'Normal' | 'Events' | 'Workers' | 'VITians';

export type GuestStatus = 'Registered' | 'Checked-in' | 'Checked-out' | 'No-show' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastActive: string;
}

export interface Guest {
  id: string;
  name: string;
  type: GuestType;
  status: GuestStatus;
  dormId: string | null;
  groupSize: number;
  assignedVolunteerId: string;
  paymentStatus: 'Paid' | 'Pending' | 'NA';
  checkInTime?: string;
  checkOutTime?: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface Dorm {
  id: string;
  name: string;
  capacity: number;
  occupiedBeds: number;
  guests: string[]; // Array of guest IDs
  lastUpdated: string;
  lastUpdatedBy: string;
}

export type UpdateType = 
  | 'Guest Status'
  | 'Dorm Assignment'
  | 'Volunteer Assignment'
  | 'Payment Update'
  | 'Check In'
  | 'Check Out'
  | 'Guest Added'
  | 'Guest Edited'
  | 'Dorm Added'
  | 'Dorm Edited';

export interface Update {
  id: string;
  timestamp: string;
  updateType: UpdateType;
  entityId: string; // ID of the guest or dorm being updated
  entityType: 'Guest' | 'Dorm';
  oldValue?: string;
  newValue: string;
  updatedBy: string; // User ID
  updatedByName: string;
  updatedByRole: UserRole;
}
