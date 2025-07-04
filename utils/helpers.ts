import { Platform } from 'react-native';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getSpeciesIcon = (species: string): string => {
  switch (species.toLowerCase()) {
    case 'dog':
      return '🐕';
    case 'cat':
      return '🐈';
    case 'bird':
      return '🦜';
    case 'rabbit':
      return '🐇';
    case 'fish':
      return '🐠';
    case 'reptile':
      return '🦎';
    default:
      return '🐾';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'feeding':
      return '🍽️';
    case 'walking':
      return '🚶';
    case 'grooming':
      return '✂️';
    case 'medication':
      return '💊';
    case 'vet':
      return '🩺';
    case 'training':
      return '🏆';
    case 'play':
      return '🎾';
    case 'cleaning':
      return '🧹';
    default:
      return '📝';
  }
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
