export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  premiumUntil?: string; // ISO date string
  aiScansRemaining: number; // For free tier limited scans
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    reminderTime: number; // Minutes before task
  };
}
