
export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Friend extends User {
  status: 'pending' | 'accepted' | 'declined';
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  isMultiDay?: boolean; // New flag for multi-day events
  location?: string;
  color: string;
  type: 'personal' | 'friend' | 'group' | 'work';
  createdBy: string;
  participants?: User[];
  groupId?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    until?: Date;
  };
}

export interface PrivacySettings {
  whoCanSeeSchedule: 'all' | 'friends' | 'none';
  whoCanInvite: 'all' | 'friends' | 'none';
  whoCanMessage: 'all' | 'friends' | 'none';
  whoCanSeeProfile: 'all' | 'friends' | 'none';
}

export type CalendarViewMode = 'month' | 'week' | 'day' | 'custom';

export interface CalendarFilters {
  showPersonalEvents: boolean;
  showFriendEvents: boolean;
  showWorkEvents: boolean;
}

// New interface for friend requests
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}
