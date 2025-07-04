import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pet } from '@/types/pet';
import { PetAvatar } from './PetAvatar';
import { Card } from './Card';
import { colors } from '@/constants/colors';
import { formatDate } from '@/utils/dateUtils';

interface PetCardProps {
  pet: Pet;
  onPress: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onPress }) => {
  const getAgeText = () => {
    if (pet.birthdate) {
      const birthDate = new Date(pet.birthdate);
      const today = new Date();
      const ageInYears = today.getFullYear() - birthDate.getFullYear();
      const ageInMonths = today.getMonth() - birthDate.getMonth();
      
      if (ageInYears > 0) {
        return `${ageInYears} ${ageInYears === 1 ? 'year' : 'years'} old`;
      } else if (ageInMonths > 0) {
        return `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'} old`;
      } else {
        const diffTime = Math.abs(today.getTime() - birthDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} old`;
      }
    } else if (pet.age) {
      return `${pet.age} ${pet.age === 1 ? 'year' : 'years'} old`;
    }
    return '';
  };

  return (
    <TouchableOpacity onPress={() => onPress(pet)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.container}>
          <PetAvatar 
            name={pet.name} 
            species={pet.species} 
            imageUri={pet.imageUri} 
            size={70} 
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.breed}>
              {pet.breed || pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
            </Text>
            {(pet.age || pet.birthdate) && (
              <Text style={styles.age}>{getAgeText()}</Text>
            )}
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          {pet.vaccinations && pet.vaccinations.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pet.vaccinations.length}</Text>
              <Text style={styles.statLabel}>Vaccinations</Text>
            </View>
          )}
          
          {pet.medicalRecords && pet.medicalRecords.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pet.medicalRecords.length}</Text>
              <Text style={styles.statLabel}>Medical Records</Text>
            </View>
          )}
          
          {pet.allergies && pet.allergies.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pet.allergies.length}</Text>
              <Text style={styles.statLabel}>Allergies</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  breed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  age: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
