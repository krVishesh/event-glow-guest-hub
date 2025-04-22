import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Guest, Dorm, Update, UserRole, GuestStatus } from './types';
import { mockUsers, mockGuests, mockDorms, mockUpdates } from './mock-data';

interface AppContextProps {
  // Current user
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Data
  users: User[];
  guests: Guest[];
  dorms: Dorm[];
  updates: Update[];
  
  // Filtering
  filteredGuests: Guest[];
  filteredDorms: Dorm[];
  filteredUpdates: Update[];
  
  // Filter states
  guestFilters: {
    search: string;
    type: string[];
    status: string[];
    dorm: string[];
    volunteer: string[];
  };
  setGuestFilters: (filters: any) => void;
  
  dormFilters: {
    search: string;
    availability: string[];
  };
  setDormFilters: (filters: any) => void;
  
  updateFilters: {
    search: string;
    type: string[];
    user: string[];
    entity: string[];
  };
  setUpdateFilters: (filters: any) => void;
  
  // CRUD operations
  updateGuest: (guest: Guest) => void;
  updateDorm: (dorm: Dorm) => void;
  addGuest: (guest: Guest) => void;
  addDorm: (dorm: Dorm) => void;
  
  // Helper functions
  getUserById: (id: string) => User | undefined;
  getGuestById: (id: string) => Guest | undefined;
  getDormById: (id: string) => Dorm | undefined;
  getUpdatesForEntity: (entityId: string) => Update[];
  canPerformAction: (action: string, entity: Guest | Dorm) => boolean;

  // Reset filters
  resetAllFilters: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state with localStorage persistence
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }, [currentUser]);

  // Wrapper for setCurrentUser to handle localStorage
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
  };
  
  // Data state
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [dorms, setDorms] = useState<Dorm[]>(mockDorms);
  const [updates, setUpdates] = useState<Update[]>(mockUpdates);
  
  // Filter states
  const [guestFilters, setGuestFilters] = useState({
    search: '',
    type: [],
    status: [],
    dorm: [],
    volunteer: []
  });
  
  const [dormFilters, setDormFilters] = useState({
    search: '',
    availability: []
  });
  
  const [updateFilters, setUpdateFilters] = useState({
    search: '',
    type: [],
    user: [],
    entity: []
  });
  
  // Apply filters to guests
  const filteredGuests = guests.filter(guest => {
    // Search filter
    if (guestFilters.search && !guest.name.toLowerCase().includes(guestFilters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (guestFilters.type.length > 0 && !guestFilters.type.includes(guest.type)) {
      return false;
    }
    
    // Status filter
    if (guestFilters.status.length > 0 && !guestFilters.status.includes(guest.status)) {
      return false;
    }
    
    // Dorm filter
    if (guestFilters.dorm.length > 0) {
      if (guestFilters.dorm.includes('None') && guest.dormId !== null) {
        return false;
      }
      
      if (guest.dormId && !guestFilters.dorm.includes(guest.dormId)) {
        return false;
      }
    }
    
    // Volunteer filter
    if (guestFilters.volunteer.length > 0 && !guestFilters.volunteer.includes(guest.assignedVolunteers.join(''))) {
      return false;
    }
    
    return true;
  });
  
  // Apply filters to dorms
  const filteredDorms = dorms.filter(dorm => {
    // Search filter
    if (dormFilters.search && !dorm.name.toLowerCase().includes(dormFilters.search.toLowerCase())) {
      return false;
    }
    
    // Availability filter
    if (dormFilters.availability.length > 0) {
      const availability = dorm.occupiedBeds < dorm.capacity ? 'Available' : 'Full';
      if (!dormFilters.availability.includes(availability)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply filters to updates
  const filteredUpdates = updates.filter(update => {
    // Search filter
    if (updateFilters.search) {
      const guest = getGuestById(update.entityId);
      const dorm = getDormById(update.entityId);
      const entityName = guest ? guest.name : dorm ? dorm.name : '';
      
      if (!entityName.toLowerCase().includes(updateFilters.search.toLowerCase()) && 
          !update.updatedByName.toLowerCase().includes(updateFilters.search.toLowerCase()) &&
          !update.updateType.toLowerCase().includes(updateFilters.search.toLowerCase())) {
        return false;
      }
    }
    
    // Type filter
    if (updateFilters.type.length > 0 && !updateFilters.type.includes(update.updateType)) {
      return false;
    }
    
    // User filter
    if (updateFilters.user.length > 0 && !updateFilters.user.includes(update.updatedBy)) {
      return false;
    }
    
    // Entity filter
    if (updateFilters.entity.length > 0 && !updateFilters.entity.includes(update.entityType)) {
      return false;
    }
    
    return true;
  });
  
  // Helper function to get a guest by ID
  const getGuestById = (id: string): Guest | undefined => {
    return guests.find(guest => guest.id === id);
  };
  
  // Helper function to get a dorm by ID
  const getDormById = (id: string): Dorm | undefined => {
    return dorms.find(dorm => dorm.id === id);
  };
  
  // Helper function to get updates for a specific entity
  const getUpdatesForEntity = (entityId: string): Update[] => {
    return updates.filter(update => update.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  
  // Helper function to get a user by ID
  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };
  
  // Function to update a guest
  const updateGuest = (updatedGuest: Guest) => {
    const now = new Date().toISOString();
    
    // Find the original guest
    const originalGuest = guests.find(g => g.id === updatedGuest.id);
    
    if (!originalGuest) return;
    
    // Create appropriate update records
    const updateRecords: Update[] = [];
    
    // Check what fields have changed
    if (originalGuest.status !== updatedGuest.status) {
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Guest Status',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        oldValue: originalGuest.status,
        newValue: updatedGuest.status,
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }

    if (originalGuest.location !== updatedGuest.location) {
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Guest Location',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        oldValue: originalGuest.location || 'None',
        newValue: updatedGuest.location || 'None',
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    if (originalGuest.dormId !== updatedGuest.dormId) {
      // Update the dorm occupancy if changed
      if (originalGuest.dormId) {
        const oldDorm = dorms.find(d => d.id === originalGuest.dormId);
        if (oldDorm) {
          const updatedOldDorm = {
            ...oldDorm,
            occupiedBeds: oldDorm.occupiedBeds - 1,
            guests: oldDorm.guests.filter(g => g !== updatedGuest.id),
            lastUpdated: now,
            lastUpdatedBy: currentUser?.id || ''
          };
          
          setDorms(prevDorms => prevDorms.map(d => d.id === oldDorm.id ? updatedOldDorm : d));
        }
      }
      
      if (updatedGuest.dormId) {
        const newDorm = dorms.find(d => d.id === updatedGuest.dormId);
        if (newDorm) {
          const updatedNewDorm = {
            ...newDorm,
            occupiedBeds: newDorm.occupiedBeds + 1,
            guests: [...newDorm.guests, updatedGuest.id],
            lastUpdated: now,
            lastUpdatedBy: currentUser?.id || ''
          };
          
          setDorms(prevDorms => prevDorms.map(d => d.id === newDorm.id ? updatedNewDorm : d));
        }
      }
      
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Dorm Assignment',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        oldValue: originalGuest.dormId || 'None',
        newValue: updatedGuest.dormId || 'None',
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    if (originalGuest.assignedVolunteers?.join('') !== updatedGuest.assignedVolunteers?.join('')) {
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Volunteer Assignment',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        oldValue: originalGuest.assignedVolunteers?.map(id => getUserById(id)?.name).join(', ') || 'None',
        newValue: updatedGuest.assignedVolunteers?.map(id => getUserById(id)?.name).join(', ') || 'None',
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    if (originalGuest.paymentStatus !== updatedGuest.paymentStatus) {
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Payment Update',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        oldValue: originalGuest.paymentStatus,
        newValue: updatedGuest.paymentStatus,
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    // Status-specific updates
    if (updatedGuest.status === 'Checked-in' && originalGuest.status !== 'Checked-in') {
      updatedGuest.checkInTime = now;
      
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Check In',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        newValue: now,
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    if (updatedGuest.status === 'Checked-out' && originalGuest.status !== 'Checked-out') {
      updatedGuest.checkOutTime = now;
      
      updateRecords.push({
        id: Math.random().toString(36).substring(2, 10),
        timestamp: now,
        updateType: 'Check Out',
        entityId: updatedGuest.id,
        entityType: 'Guest',
        newValue: now,
        updatedBy: currentUser?.id || '',
        updatedByName: currentUser?.name || '',
        updatedByRole: currentUser?.role || 'Volunteer'
      });
    }
    
    // Update last updated info
    const finalGuest = {
      ...updatedGuest,
      lastUpdated: now,
      lastUpdatedBy: currentUser?.id || ''
    };
    
    // Update guests state
    setGuests(prevGuests => prevGuests.map(g => g.id === updatedGuest.id ? finalGuest : g));
    
    // Add update records to updates state
    if (updateRecords.length > 0) {
      setUpdates(prevUpdates => [...updateRecords, ...prevUpdates]);
    }
  };
  
  // Function to update a dorm
  const updateDorm = (updatedDorm: Dorm) => {
    const now = new Date().toISOString();
    
    // Find the original dorm
    const originalDorm = dorms.find(d => d.id === updatedDorm.id);
    
    if (!originalDorm) return;
    
    // Update last updated info
    const finalDorm = {
      ...updatedDorm,
      lastUpdated: now,
      lastUpdatedBy: currentUser?.id || ''
    };
    
    // Create update record
    const updateRecord: Update = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: now,
      updateType: 'Dorm Edited',
      entityId: updatedDorm.id,
      entityType: 'Dorm',
      oldValue: `${originalDorm.occupiedBeds}/${originalDorm.capacity}`,
      newValue: `${updatedDorm.occupiedBeds}/${updatedDorm.capacity}`,
      updatedBy: currentUser?.id || '',
      updatedByName: currentUser?.name || '',
      updatedByRole: currentUser?.role || 'Volunteer'
    };
    
    // Update dorms state
    setDorms(prevDorms => prevDorms.map(d => d.id === updatedDorm.id ? finalDorm : d));
    
    // Add update record to updates state
    setUpdates(prevUpdates => [updateRecord, ...prevUpdates]);
  };
  
  // Function to add a new guest
  const addGuest = (newGuest: Guest) => {
    const now = new Date().toISOString();
    
    // Generate an ID if one doesn't exist
    if (!newGuest.id) {
      newGuest.id = Math.random().toString(36).substring(2, 10);
    }
    
    // Set last updated info
    const finalGuest = {
      ...newGuest,
      lastUpdated: now,
      lastUpdatedBy: currentUser?.id || ''
    };
    
    // Update dorm if assigned
    if (newGuest.dormId) {
      const dorm = dorms.find(d => d.id === newGuest.dormId);
      if (dorm) {
        const updatedDorm = {
          ...dorm,
          occupiedBeds: dorm.occupiedBeds + 1,
          guests: [...dorm.guests, newGuest.id],
          lastUpdated: now,
          lastUpdatedBy: currentUser?.id || ''
        };
        
        setDorms(prevDorms => prevDorms.map(d => d.id === dorm.id ? updatedDorm : d));
      }
    }
    
    // Create update record
    const updateRecord: Update = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: now,
      updateType: 'Guest Added',
      entityId: newGuest.id,
      entityType: 'Guest',
      newValue: newGuest.name,
      updatedBy: currentUser?.id || '',
      updatedByName: currentUser?.name || '',
      updatedByRole: currentUser?.role || 'Volunteer'
    };
    
    // Update states
    setGuests(prevGuests => [...prevGuests, finalGuest]);
    setUpdates(prevUpdates => [updateRecord, ...prevUpdates]);
  };
  
  // Function to add a new dorm
  const addDorm = (newDorm: Dorm) => {
    const now = new Date().toISOString();
    
    // Generate an ID if one doesn't exist
    if (!newDorm.id) {
      newDorm.id = Math.random().toString(36).substring(2, 10);
    }
    
    // Set last updated info
    const finalDorm = {
      ...newDorm,
      lastUpdated: now,
      lastUpdatedBy: currentUser?.id || ''
    };
    
    // Create update record
    const updateRecord: Update = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: now,
      updateType: 'Dorm Added',
      entityId: newDorm.id,
      entityType: 'Dorm',
      newValue: newDorm.name,
      updatedBy: currentUser?.id || '',
      updatedByName: currentUser?.name || '',
      updatedByRole: currentUser?.role || 'Volunteer'
    };
    
    // Update states
    setDorms(prevDorms => [...prevDorms, finalDorm]);
    setUpdates(prevUpdates => [updateRecord, ...prevUpdates]);
  };

  // Function to reset all filters
  const resetAllFilters = () => {
    setGuestFilters({
      search: '',
      type: [],
      status: [],
      dorm: [],
      volunteer: []
    });
    
    setDormFilters({
      search: '',
      availability: []
    });
    
    setUpdateFilters({
      search: '',
      type: [],
      user: [],
      entity: []
    });
  };
  
  // Function to check if the current user can perform an action
  const canPerformAction = (action: string, entity: Guest | Dorm): boolean => {
    if (!currentUser) return false;
    
    switch (currentUser.role) {
      case 'Manager':
      case 'Coordinator':
        return true;
        
      case 'Desk':
        if (action === 'view_updates') return false;
        if (action === 'add_guest' || action === 'add_dorm') return true;
        if (action === 'update_payment' || action === 'update_dorm') return true;
        if (action === 'update_status' || action === 'update_location') return true;
        return true;
        
      case 'Volunteer':
        // Volunteers can only update status and location of their assigned guests
        if ('assignedVolunteers' in entity) {
          if (!entity.assignedVolunteers?.includes(currentUser.id)) {
            return false;
          }
          
          // Volunteers can only update status (except check-in/out) and location
          return action === 'update_status' || action === 'update_location';
        }
        return false;
        
      default:
        return false;
    }
  };
  
  const contextValue: AppContextProps = {
    currentUser,
    setCurrentUser,
    users,
    guests,
    dorms,
    updates,
    filteredGuests,
    filteredDorms,
    filteredUpdates,
    guestFilters,
    setGuestFilters,
    dormFilters,
    setDormFilters,
    updateFilters,
    setUpdateFilters,
    updateGuest,
    updateDorm,
    addGuest,
    addDorm,
    getUserById,
    getGuestById,
    getDormById,
    getUpdatesForEntity,
    canPerformAction,
    resetAllFilters
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
