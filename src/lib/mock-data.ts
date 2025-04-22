
import { User, Guest, Dorm, Update, GuestType, GuestStatus, UpdateType, UserRole } from './types';

// Generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Generate timestamps within the last 3 days
const generateTimestamp = () => {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 72); // Random hours between 0 and 72 (3 days)
  const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  return timestamp.toISOString();
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'usr1',
    name: 'Ravi Kumar',
    role: 'Volunteer',
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'usr2',
    name: 'Priya Sharma',
    role: 'Volunteer',
    isActive: false,
    lastActive: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'usr3',
    name: 'Amit Patel',
    role: 'Desk',
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'usr4',
    name: 'Neha Singh',
    role: 'Coordinator',
    isActive: true,
    lastActive: new Date().toISOString()
  },
  {
    id: 'usr5',
    name: 'Vikram Malhotra',
    role: 'Manager',
    isActive: true,
    lastActive: new Date().toISOString()
  }
];

// Mock Dorms
export const mockDorms: Dorm[] = [
  {
    id: 'dorm1',
    name: 'G Block - 101',
    capacity: 4,
    occupiedBeds: 3,
    guests: ['guest1', 'guest4', 'guest7'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'dorm2',
    name: 'G Block - 102',
    capacity: 4,
    occupiedBeds: 2,
    guests: ['guest2', 'guest5'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'dorm3',
    name: 'G Block - 103',
    capacity: 6,
    occupiedBeds: 4,
    guests: ['guest3', 'guest6', 'guest9', 'guest12'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'dorm4',
    name: 'H Block - 201',
    capacity: 2,
    occupiedBeds: 2,
    guests: ['guest8', 'guest10'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'dorm5',
    name: 'H Block - 202',
    capacity: 2,
    occupiedBeds: 1,
    guests: ['guest11'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'dorm6',
    name: 'K Block - 301',
    capacity: 8,
    occupiedBeds: 5,
    guests: ['guest13', 'guest14', 'guest15', 'guest16', 'guest17'],
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr5'
  }
];

// Mock Guests
export const mockGuests: Guest[] = [
  {
    id: 'guest1',
    name: 'Dr. Rajesh Khanna',
    type: 'Special',
    status: 'Checked-in',
    dormId: 'dorm1',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'NA',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest2',
    name: 'Sophia Chen',
    type: 'Foreign',
    status: 'Checked-in',
    dormId: 'dorm2',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest3',
    name: 'Arjun Kapoor',
    type: 'Normal',
    status: 'Checked-in',
    dormId: 'dorm3',
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'guest4',
    name: 'Kim Minji',
    type: 'Foreign',
    status: 'Checked-in',
    dormId: 'dorm1',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest5',
    name: 'Rohan Mehta',
    type: 'Normal',
    status: 'Registered',
    dormId: 'dorm2',
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'Pending',
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest6',
    name: 'Aishwarya Rao',
    type: 'Events',
    status: 'Checked-in',
    dormId: 'dorm3',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'guest7',
    name: 'Mark Johnson',
    type: 'Foreign',
    status: 'Checked-in',
    dormId: 'dorm1',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest8',
    name: 'Sanjay Dutt',
    type: 'Special',
    status: 'Checked-in',
    dormId: 'dorm4',
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'NA',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'guest9',
    name: 'Technical Team Alpha',
    type: 'Workers',
    status: 'Checked-in',
    dormId: 'dorm3',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'NA',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr5'
  },
  {
    id: 'guest10',
    name: 'Prof. Emma Wilson',
    type: 'Special',
    status: 'Checked-in',
    dormId: 'dorm4',
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'NA',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest11',
    name: 'Rahul Singh',
    type: 'VITians',
    status: 'Checked-in',
    dormId: 'dorm5',
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'NA',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  },
  {
    id: 'guest12',
    name: 'Sara Ahmed',
    type: 'Foreign',
    status: 'No-show',
    dormId: 'dorm3',
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'Paid',
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest13',
    name: 'Dance Troupe',
    type: 'Events',
    status: 'Checked-in',
    dormId: 'dorm6',
    groupSize: 5,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'Paid',
    checkInTime: generateTimestamp(),
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr5'
  },
  {
    id: 'guest14',
    name: 'Zoya Khan',
    type: 'Normal',
    status: 'Registered',
    dormId: null,
    groupSize: 1,
    assignedVolunteerId: 'usr2',
    paymentStatus: 'Pending',
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr3'
  },
  {
    id: 'guest15',
    name: 'Varun Dhawan',
    type: 'Special',
    status: 'Registered',
    dormId: null,
    groupSize: 1,
    assignedVolunteerId: 'usr1',
    paymentStatus: 'NA',
    lastUpdated: generateTimestamp(),
    lastUpdatedBy: 'usr4'
  }
];

// Generate Update History
const generateUpdateHistory = () => {
  const updates: Update[] = [];
  
  // Add some updates for each guest and dorm
  mockGuests.forEach(guest => {
    const updateTypes: UpdateType[] = ['Guest Status', 'Dorm Assignment', 'Volunteer Assignment', 'Payment Update', 'Check In'];
    
    // Generate 1-3 random updates per guest
    const numUpdates = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numUpdates; i++) {
      const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
      const updatedBy = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      
      updates.push({
        id: generateId(),
        timestamp: generateTimestamp(),
        updateType,
        entityId: guest.id,
        entityType: 'Guest',
        oldValue: updateType === 'Guest Status' ? 'Registered' : 'Previous Value',
        newValue: updateType === 'Guest Status' ? guest.status : 'New Value',
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        updatedByRole: updatedBy.role
      });
    }
  });
  
  mockDorms.forEach(dorm => {
    // Generate 1-2 random updates per dorm
    const numUpdates = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numUpdates; i++) {
      const updatedBy = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      
      updates.push({
        id: generateId(),
        timestamp: generateTimestamp(),
        updateType: 'Dorm Edited',
        entityId: dorm.id,
        entityType: 'Dorm',
        oldValue: `${dorm.occupiedBeds - 1}/${dorm.capacity}`,
        newValue: `${dorm.occupiedBeds}/${dorm.capacity}`,
        updatedBy: updatedBy.id,
        updatedByName: updatedBy.name,
        updatedByRole: updatedBy.role
      });
    }
  });
  
  // Sort updates by timestamp (newest first)
  return updates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const mockUpdates: Update[] = generateUpdateHistory();

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Get guest by ID
export const getGuestById = (id: string): Guest | undefined => {
  return mockGuests.find(guest => guest.id === id);
};

// Get dorm by ID
export const getDormById = (id: string): Dorm | undefined => {
  return mockDorms.find(dorm => dorm.id === id);
};

// Format timestamp to readable format
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format time ago
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
