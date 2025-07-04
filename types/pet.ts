export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'reptile' | 'other';

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  expiryDate: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  type: 'checkup' | 'treatment' | 'surgery' | 'other';
  date: string;
  description: string;
  vetName?: string;
  documents?: string[];
}

export interface FeedingSchedule {
  id: string;
  time: string;
  portion: string;
  foodType: string;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: 'vet' | 'emergency' | 'sitter' | 'other';
  phone: string;
  email?: string;
  address?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  age?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  birthdate?: string;
  color?: string;
  gender?: 'male' | 'female' | 'unknown';
  microchipped?: boolean;
  microchipId?: string;
  neutered?: boolean;
  imageUri?: string;
  notes?: string;
  allergies?: string[];
  medications?: string[];
  vaccinations?: Vaccination[];
  medicalRecords?: MedicalRecord[];
  feedingSchedules?: FeedingSchedule[];
  contacts?: Contact[];
}
