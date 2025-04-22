import { User, Guest, Dorm, Update } from './types';

// Helper function to format time ago
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const getUserById = (id: string, users: User[]): User | undefined => {
  return users.find(user => user.id === id);
};

export const mockGuests: Guest[] = [
  {
    id: "g1",
    name: "John Smith",
    type: "Normal",
    status: "Registered",
    dormId: "d1",
    groupSize: 2,
    assignedVolunteers: ["v1", "v2"],
    paymentStatus: "Pending",
    location: "Registration Desk",
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u1"
  },
  {
    id: "g2",
    name: "Alice Johnson",
    type: "VITians",
    status: "Checked-in",
    dormId: "d2",
    groupSize: 1,
    assignedVolunteers: ["v1"],
    paymentStatus: "Paid",
    location: "Block A",
    checkInTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u2"
  },
  {
    id: "g3",
    name: "Bob Williams",
    type: "Foreign",
    status: "Checked-out",
    dormId: "d3",
    groupSize: 3,
    assignedVolunteers: ["v2"],
    paymentStatus: "Paid",
    location: "Airport",
    checkOutTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u3"
  },
  {
    id: "g4",
    name: "Emily Brown",
    type: "Special",
    status: "Registered",
    dormId: null,
    groupSize: 1,
    assignedVolunteers: [],
    paymentStatus: "NA",
    location: "VIP Lounge",
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u1"
  },
  {
    id: "g5",
    name: "David Jones",
    type: "Events",
    status: "Checked-in",
    dormId: "d1",
    groupSize: 2,
    assignedVolunteers: ["v1", "v2"],
    paymentStatus: "Pending",
    location: "Main Hall",
    checkInTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u2"
  },
  {
    id: "g6",
    name: "Grace Miller",
    type: "Workers",
    status: "Registered",
    dormId: "d2",
    groupSize: 1,
    assignedVolunteers: ["v1"],
    paymentStatus: "Paid",
    location: "Backstage",
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u3"
  },
  {
    id: "g7",
    name: "Michael Davis",
    type: "Normal",
    status: "Checked-out",
    dormId: "d3",
    groupSize: 4,
    assignedVolunteers: ["v2"],
    paymentStatus: "Pending",
    location: "Parking Lot",
    checkOutTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u1"
  },
  {
    id: "g8",
    name: "Sophia Garcia",
    type: "VITians",
    status: "Checked-in",
    dormId: "d1",
    groupSize: 1,
    assignedVolunteers: ["v1"],
    paymentStatus: "NA",
    location: "Cafeteria",
    checkInTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u2"
  },
  {
    id: "g9",
    name: "Daniel Rodriguez",
    type: "Foreign",
    status: "Registered",
    dormId: null,
    groupSize: 2,
    assignedVolunteers: ["v2"],
    paymentStatus: "Paid",
    location: "Information Desk",
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u3"
  },
  {
    id: "g10",
    name: "Olivia Martinez",
    type: "Special",
    status: "Checked-out",
    dormId: "d2",
    groupSize: 1,
    assignedVolunteers: [],
    paymentStatus: "Pending",
    location: "Hotel",
    checkOutTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u1"
  }
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Manager",
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "u2",
    name: "Coordinator User",
    email: "coordinator@example.com",
    role: "Coordinator",
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "u3",
    name: "Desk User",
    email: "desk@example.com",
    role: "Desk",
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "v1",
    name: "Volunteer 1",
    email: "volunteer1@example.com",
    role: "Volunteer",
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: "v2",
    name: "Volunteer 2",
    email: "volunteer2@example.com",
    role: "Volunteer",
    isActive: true,
    lastActive: new Date().toISOString()
  }
];

export const mockDorms: Dorm[] = [
  {
    id: "d1",
    name: "Dorm A",
    capacity: 10,
    occupiedBeds: 4,
    guests: ["g1", "g5", "g8"],
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u1"
  },
  {
    id: "d2",
    name: "Dorm B",
    capacity: 12,
    occupiedBeds: 6,
    guests: ["g2", "g6", "g10"],
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u2"
  },
  {
    id: "d3",
    name: "Dorm C",
    capacity: 8,
    occupiedBeds: 2,
    guests: ["g3", "g7"],
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: "u3"
  }
];

export const mockUpdates: Update[] = [
  {
    id: "u1",
    timestamp: new Date().toISOString(),
    updateType: "Guest Status",
    entityId: "g1",
    entityType: "Guest",
    oldValue: "Registered",
    newValue: "Checked-in",
    updatedBy: "u1",
    updatedByName: "Admin",
    updatedByRole: "Manager"
  },
  {
    id: "u2",
    timestamp: new Date().toISOString(),
    updateType: "Dorm Assignment",
    entityId: "g2",
    entityType: "Guest",
    oldValue: "None",
    newValue: "Dorm A",
    updatedBy: "u2",
    updatedByName: "Desk Staff",
    updatedByRole: "Desk"
  },
  {
    id: "u3",
    timestamp: new Date().toISOString(),
    updateType: "Payment Update",
    entityId: "g3",
    entityType: "Guest",
    oldValue: "Pending",
    newValue: "Paid",
    updatedBy: "u3",
    updatedByName: "Volunteer 1",
    updatedByRole: "Volunteer"
  }
];
