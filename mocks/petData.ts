import { Pet } from '@/types/pet';
import { generateId } from '@/utils/helpers';

export const mockPets: Pet[] = [
  {
    id: generateId(),
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    color: 'Golden',
    neutered: true,
    microchipped: true,
    microchipId: 'CHIP123456',
    imageUri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=624&q=80',
    notes: 'Loves to play fetch and swim',
    allergies: ['Chicken', 'Wheat'],
    vaccinations: [
      {
        id: generateId(),
        name: 'Rabies',
        date: '2023-05-15',
        expiryDate: '2024-05-15',
      },
      {
        id: generateId(),
        name: 'DHPP',
        date: '2023-02-10',
        expiryDate: '2024-02-10',
      },
    ],
    medicalRecords: [
      {
        id: generateId(),
        type: 'checkup',
        date: '2023-06-20',
        description: 'Annual checkup - all good',
        vetName: 'Dr. Smith',
      },
    ],
    feedingSchedules: [
      {
        id: generateId(),
        time: '08:00',
        portion: '1 cup',
        foodType: 'Dry kibble',
      },
      {
        id: generateId(),
        time: '18:00',
        portion: '1 cup',
        foodType: 'Dry kibble with wet food',
      },
    ],
    contacts: [
      {
        id: generateId(),
        name: 'City Vet Clinic',
        role: 'vet',
        phone: '555-123-4567',
        email: 'cityvet@example.com',
      },
    ],
  },
  {
    id: generateId(),
    name: 'Whiskers',
    species: 'cat',
    breed: 'Siamese',
    age: 5,
    gender: 'female',
    color: 'Cream with brown points',
    neutered: true,
    imageUri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1143&q=80',
    notes: 'Very vocal, loves to sit on laps',
    allergies: ['Dairy'],
    vaccinations: [
      {
        id: generateId(),
        name: 'Rabies',
        date: '2023-04-10',
        expiryDate: '2024-04-10',
      },
      {
        id: generateId(),
        name: 'FVRCP',
        date: '2023-04-10',
        expiryDate: '2024-04-10',
      },
    ],
    feedingSchedules: [
      {
        id: generateId(),
        time: '07:00',
        portion: '1/4 cup',
        foodType: 'Dry cat food',
      },
      {
        id: generateId(),
        time: '19:00',
        portion: '1/4 cup',
        foodType: 'Wet cat food',
      },
    ],
  },
];
