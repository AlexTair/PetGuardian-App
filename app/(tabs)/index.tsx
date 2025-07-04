import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { usePetStore } from '@/hooks/usePetStore';
import { useTaskStore } from '@/hooks/useTaskStore';
import { useUserStore } from '@/hooks/useUserStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { PetAvatar } from '@/components/PetAvatar';
import { TaskItem } from '@/components/TaskItem';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { AIFeatureCard } from '@/components/AIFeatureCard';
import { PremiumBadge } from '@/components/PremiumBadge';
import { Camera, Plus, Scan, AlertCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { pets } = usePetStore();
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { user, isPremium } = useUserStore();
  
  const todaysTasks = tasks.filter(task => {
    const taskDate = new Date(task.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return taskDate === today;
  });
  
  const completedTasks = todaysTasks.filter(task => task.completed);
  const pendingTasks = todaysTasks.filter(task => !task.completed);
  
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : '';
  };

  const handleAddTask = () => {
    router.push('/task/add');
  };

  const handleOpenAIScanner = () => {
    if (isPremium() || (user && user.aiScansRemaining > 0)) {
      router.push('/ai/scanner');
    } else {
      router.push('/premium');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Pet Parent'}</Text>
        <Text style={styles.subtitle}>
          {pendingTasks.length > 0 
            ? `You have ${pendingTasks.length} tasks remaining today` 
            : 'All tasks completed for today!'}
        </Text>
      </View>

      {/* Pet Quick Access */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Pets</Text>
          <Link href="/pets" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {pets.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsContainer}
          >
            {pets.map(pet => (
              <TouchableOpacity 
                key={pet.id} 
                style={styles.petItem}
                onPress={() => router.push(`/pet/${pet.id}`)}
              >
                <PetAvatar 
                  name={pet.name} 
                  species={pet.species} 
                  imageUri={pet.imageUri} 
                  size={70} 
                />
                <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.addPetButton}
              onPress={() => router.push('/pet/add')}
            >
              <View style={styles.addPetIcon}>
                <Plus size={24} color={colors.primary} />
              </View>
              <Text style={styles.addPetText}>Add Pet</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Card style={styles.emptyPetsCard}>
            <Text style={styles.emptyPetsText}>
              You haven't added any pets yet. Add your first pet to get started!
            </Text>
            <Button 
              title="Add Your First Pet" 
              onPress={() => router.push('/pet/add')} 
              style={styles.emptyPetsButton}
            />
          </Card>
        )}
      </View>

      {/* Today's Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Link href="/schedule" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {todaysTasks.length > 0 ? (
          <View>
            {pendingTasks.slice(0, 3).map(task => (
              <TaskItem
                key={task.id}
                task={task}
                petName={getPetName(task.petId)}
                onToggle={toggleTaskCompletion}
                onPress={(task) => router.push(`/task/${task.id}`)}
              />
            ))}
            
            {pendingTasks.length > 3 && (
              <Button
                title={`View ${pendingTasks.length - 3} More Tasks`}
                onPress={() => router.push('/schedule')}
                variant="outline"
                style={styles.viewMoreButton}
              />
            )}
            
            {pendingTasks.length === 0 && completedTasks.length > 0 && (
              <View style={styles.allCompletedContainer}>
                <Text style={styles.allCompletedText}>
                  All tasks completed for today! 🎉
                </Text>
              </View>
            )}
          </View>
        ) : (
          <EmptyState
            title="No Tasks Today"
            message="Add tasks to keep track of your pet care routine"
            actionLabel="Add Task"
            onAction={handleAddTask}
            icon={<AlertCircle size={40} color={colors.primary} />}
          />
        )}
      </View>

      {/* AI Features */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Health Tools</Text>
          {isPremium() && <PremiumBadge />}
        </View>
        
        <AIFeatureCard
          title="AI Health Scanner"
          description="Scan your pet's skin, eyes, or stool to check for common health issues"
          icon={<Camera size={24} color={colors.primary} />}
          imageUrl="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
          isPremiumOnly={true}
          isLocked={!isPremium() && (!user || user.aiScansRemaining <= 0)}
          onPress={handleOpenAIScanner}
        />
        
        {!isPremium() && user && (
          <View style={styles.scansRemainingContainer}>
            <Text style={styles.scansRemainingText}>
              {user.aiScansRemaining} free scans remaining
            </Text>
            <TouchableOpacity onPress={() => router.push('/premium')}>
              <Text style={styles.upgradePremiumText}>
                Upgrade to Premium for unlimited scans
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  petsContainer: {
    paddingRight: 16,
  },
  petItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  petName: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  addPetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  addPetIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  addPetText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  emptyPetsCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyPetsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyPetsButton: {
    minWidth: 200,
  },
  viewMoreButton: {
    marginTop: 8,
  },
  allCompletedContainer: {
    padding: 16,
    backgroundColor: colors.success + '15', // 15% opacity
    borderRadius: 12,
    alignItems: 'center',
  },
  allCompletedText: {
    color: colors.success,
    fontWeight: '600',
  },
  scansRemainingContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  scansRemainingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  upgradePremiumText: {
    fontSize: 14,
    color: colors.premium,
    fontWeight: '500',
    marginTop: 4,
  },
});
