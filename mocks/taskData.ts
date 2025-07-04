import { Task } from '@/types/task';
import { generateId } from '@/utils/helpers';

// Get today's date as ISO string
const today = new Date().toISOString().split('T')[0];

// Get tomorrow's date as ISO string
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

// Get date 3 days from now
const threeDaysLater = new Date();
threeDaysLater.setDate(threeDaysLater.getDate() + 3);
const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

export const createMockTasks = (petIds: string[]): Task[] => {
  if (petIds.length === 0) return [];
  
  return [
    {
      id: generateId(),
      petId: petIds[0],
      title: 'Morning Feed',
      description: 'One cup of dry food',
      category: 'feeding',
      date: today,
      time: '08:00',
      frequency: 'daily',
      completed: false,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds[0],
      title: 'Evening Feed',
      description: 'One cup of dry food with wet food topper',
      category: 'feeding',
      date: today,
      time: '18:00',
      frequency: 'daily',
      completed: false,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds[0],
      title: 'Morning Walk',
      description: '30 minute walk around the neighborhood',
      category: 'walking',
      date: today,
      time: '07:30',
      frequency: 'daily',
      completed: true,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds[0],
      title: 'Evening Walk',
      description: '20 minute walk at the park',
      category: 'walking',
      date: today,
      time: '19:00',
      frequency: 'daily',
      completed: false,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds[0],
      title: 'Vet Appointment',
      description: 'Annual checkup and vaccinations',
      category: 'vet',
      date: threeDaysLaterStr,
      time: '14:30',
      frequency: 'once',
      completed: false,
      notifyBefore: 60,
    },
    {
      id: generateId(),
      petId: petIds.length > 1 ? petIds[1] : petIds[0],
      title: 'Morning Feed',
      description: '1/4 cup of dry food',
      category: 'feeding',
      date: today,
      time: '07:00',
      frequency: 'daily',
      completed: true,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds.length > 1 ? petIds[1] : petIds[0],
      title: 'Evening Feed',
      description: '1/4 cup of wet food',
      category: 'feeding',
      date: today,
      time: '19:00',
      frequency: 'daily',
      completed: false,
      notifyBefore: 15,
    },
    {
      id: generateId(),
      petId: petIds.length > 1 ? petIds[1] : petIds[0],
      title: 'Clean Litter Box',
      description: 'Scoop and replace if needed',
      category: 'cleaning',
      date: today,
      frequency: 'daily',
      completed: false,
    },
    {
      id: generateId(),
      petId: petIds.length > 1 ? petIds[1] : petIds[0],
      title: 'Grooming Session',
      description: 'Brush fur and check for mats',
      category: 'grooming',
      date: tomorrowStr,
      frequency: 'weekly',
      completed: false,
      repeatDays: [2, 5], // Tuesday and Friday
    },
  ];
};
