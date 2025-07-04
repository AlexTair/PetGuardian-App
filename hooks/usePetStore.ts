import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '@/types/pet';

interface PetState {
  pets: Pet[];
  selectedPetId: string | null;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, pet: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  selectPet: (id: string | null) => void;
  getPet: (id: string) => Pet | undefined;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: [],
      selectedPetId: null,
      addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
      updatePet: (id, updatedPet) =>
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id ? { ...pet, ...updatedPet } : pet
          ),
        })),
      deletePet: (id) =>
        set((state) => ({
          pets: state.pets.filter((pet) => pet.id !== id),
          selectedPetId: state.selectedPetId === id ? null : state.selectedPetId,
        })),
      selectPet: (id) => set({ selectedPetId: id }),
      getPet: (id) => get().pets.find((pet) => pet.id === id),
    }),
    {
      name: 'pet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
