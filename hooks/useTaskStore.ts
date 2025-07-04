import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasksByPet: (petId: string) => Task[];
  getTasksByDate: (date: string) => Task[];
  getTodaysTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      getTasksByPet: (petId) => get().tasks.filter((task) => task.petId === petId),
      getTasksByDate: (date) => {
        const dateStr = new Date(date).toISOString().split('T')[0];
        return get().tasks.filter((task) => {
          const taskDate = new Date(task.date).toISOString().split('T')[0];
          return taskDate === dateStr;
        });
      },
      getTodaysTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().getTasksByDate(today);
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
