import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card } from './Card';
import { colors } from '@/constants/colors';
import { PremiumBadge } from './PremiumBadge';
import { Lock } from 'lucide-react-native';

interface AIFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl?: string;
  isPremiumOnly: boolean;
  isLocked: boolean;
  onPress: () => void;
}

export const AIFeatureCard: React.FC<AIFeatureCardProps> = ({
  title,
  description,
  icon,
  imageUrl,
  isPremiumOnly,
  isLocked,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>{icon}</View>
          {isPremiumOnly && <PremiumBadge />}
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        )}
        
        {isLocked && (
          <View style={styles.lockedOverlay}>
            <Lock size={24} color="white" />
            <Text style={styles.lockedText}>
              {isPremiumOnly ? 'Premium Feature' : 'Unlock Feature'}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
