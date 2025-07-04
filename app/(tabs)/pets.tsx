import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePetStore } from '@/hooks/usePetStore';
import { colors } from '@/constants/colors';
import { PetCard } from '@/components/PetCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { PawPrint, Plus } from 'lucide-react-native';

export default function PetsScreen() {
  const router = useRouter();
  const { pets } = usePetStore();

  const handleAddPet = () => {
    router.push('/pet/add');
  };

  const handlePetPress = (petId: string) => {
    router.push(`/pet/${petId}`);
  };

  return (
    <View style={styles.container}>
      {pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard 
              pet={item} 
              onPress={() => handlePetPress(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          title="No Pets Added Yet"
          message="Add your pets to keep track of their care routines, medical records, and more."
          actionLabel="Add Your First Pet"
          onAction={handleAddPet}
          icon={<PawPrint size={40} color={colors.primary} />}
        />
      )}

      <View style={styles.fabContainer}>
        <Button
          title="Add Pet"
          onPress={handleAddPet}
          icon={<Plus size={20} color="white" />}
          style={styles.fab}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fab: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
