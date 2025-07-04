import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getInitials, getSpeciesIcon } from '@/utils/helpers';
import { colors } from '@/constants/colors';

interface PetAvatarProps {
  name: string;
  species: string;
  imageUri?: string;
  size?: number;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  name,
  species,
  imageUri,
  size = 60,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
    },
    fallback: {
      fontSize: size * 0.4,
      color: 'white',
      fontWeight: 'bold',
    },
    speciesIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: size / 6,
      width: size / 3,
      height: size / 3,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    speciesText: {
      fontSize: size / 4,
    },
  });

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.fallback}>{getInitials(name)}</Text>
      )}
      <View style={styles.speciesIcon}>
        <Text style={styles.speciesText}>{getSpeciesIcon(species)}</Text>
      </View>
    </View>
  );
};
