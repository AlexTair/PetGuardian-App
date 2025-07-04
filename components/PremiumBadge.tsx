import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  size = 'medium' 
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 12;
      default:
        return 10;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 4 };
      case 'large':
        return { paddingVertical: 4, paddingHorizontal: 8 };
      default:
        return { paddingVertical: 3, paddingHorizontal: 6 };
    }
  };

  return (
    <View style={[styles.container, getPadding()]}>
      <Text style={[styles.text, { fontSize: getFontSize() }]}>PREMIUM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.premium,
    borderRadius: 4,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});
