export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

export type TaskCategory = 
  | 'feeding' 
  | 'walking' 
  | 'grooming' 
  | 'medication' 
  | 'vet' 
  | 'training'
  | 'play'
  | 'cleaning'
  | 'other';

export interface Task {
  id: string;
  petId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  date: string; // ISO date string
  time?: string; // HH:MM format
  frequency: TaskFrequency;
  completed: boolean;
  notifyBefore?: number; // minutes before to notify
  repeatDays?: number[]; // 0-6 for days of week (if weekly)
  repeatMonthDay?: number; // day of month (if monthly)
  customInterval?: {
    value: number;
    unit: 'day' | 'week' | 'month';
  };
}
