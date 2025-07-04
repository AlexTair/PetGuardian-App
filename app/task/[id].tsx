import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTaskStore } from '@/hooks/useTaskStore';
import { usePetStore } from '@/hooks/usePetStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PetAvatar } from '@/components/PetAvatar';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { getCategoryIcon } from '@/utils/helpers';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Repeat, 
  Edit, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const { getPet } = usePetStore();
  
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }
  
  const pet = getPet(task.petId);
  
  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }
  
  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteTask(task.id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleEditTask = () => {
    // Navigate to edit task screen (not implemented in this example)
    console.log('Edit task:', task.id);
  };
  
  const getFrequencyText = () => {
    switch (task.frequency) {
      case 'once':
        return 'One time only';
      case 'daily':
        return 'Every day';
      case 'weekly':
        return 'Every week';
      case 'monthly':
        return 'Every month';
      default:
        return 'Custom';
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen 
        options={{
          title: 'Task Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title=""
                onPress={handleEditTask}
                variant="text"
                icon={<Edit size={20} color={colors.primary} />}
                style={{ marginRight: 16 }}
              />
              <Button
                title=""
                onPress={handleDeleteTask}
                variant="text"
                icon={<Trash2 size={20} color={colors.error} />}
              />
            </View>
          ),
        }} 
      />
      
      {/* Task Header */}
      <View style={styles.header}>
        <View style={styles.categoryIcon}>
          <Text style={styles.categoryIconText}>
            {getCategoryIcon(task.category)}
          </Text>
        </View>
        
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskCategory}>
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Text>
        </View>
        
        <Button
          title=""
          onPress={() => toggleTaskCompletion(task.id)}
          variant="text"
          icon={task.completed ? 
            <X size={24} color={colors.error} /> : 
            <Check size={24} color={colors.success} />
          }
        />
      </View>
      
      {/* Task Status */}
      <View style={[
        styles.statusContainer,
        task.completed ? styles.completedStatus : styles.pendingStatus,
      ]}>
        <Text style={styles.statusText}>
          {task.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
      
      {/* Task Details */}
      <View style={styles.section}>
        {task.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.detailText}>
              {formatDate(task.date)}
            </Text>
          </View>
          
          {task.time && (
            <View style={styles.detailItem}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.detailText}>
                {formatTime(task.time)}
              </Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Repeat size={20} color={colors.primary} />
            <Text style={styles.detailText}>
              {getFrequencyText()}
            </Text>
          </View>
          
          {task.notifyBefore && (
            <View style={styles.detailItem}>
              <Bell size={20} color={colors.primary} />
              <Text style={styles.detailText}>
                Notify {task.notifyBefore} minutes before
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Pet Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet</Text>
        
        <View style={styles.petContainer}>
          <PetAvatar 
            name={pet.name} 
            species={pet.species} 
            imageUri={pet.imageUri} 
            size={60} 
          />
          
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>
              {pet.breed || pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
            </Text>
          </View>
          
          <Button
            title="View Pet"
            onPress={() => router.push(`/pet/${pet.id}`)}
            variant="outline"
            size="small"
          />
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          onPress={() => toggleTaskCompletion(task.id)}
          variant={task.completed ? "outline" : "primary"}
          icon={task.completed ? 
            <X size={20} color={colors.primary} /> : 
            <Check size={20} color="white" />
          }
          fullWidth
        />
        
        <Button
          title="Delete Task"
          onPress={handleDeleteTask}
          variant="outline"
          style={styles.deleteButton}
          textStyle={{ color: colors.error }}
          icon={<Trash2 size={18} color={colors.error} />}
          fullWidth
        />
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
  headerButtons: {
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconText: {
    fontSize: 30,
  },
  taskInfo: {
    flex: 1,
    marginLeft: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  taskCategory: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  completedStatus: {
    backgroundColor: colors.success + '15', // 15% opacity
  },
  pendingStatus: {
    backgroundColor: colors.warning + '15', // 15% opacity
  },
  statusText: {
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  descriptionContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  petInfo: {
    flex: 1,
    marginLeft: 16,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsContainer: {
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 12,
    borderColor: colors.error,
  },
});
