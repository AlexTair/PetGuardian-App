import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { usePetStore } from '@/hooks/usePetStore';
import { useTaskStore } from '@/hooks/useTaskStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PetAvatar } from '@/components/PetAvatar';
import { Task, TaskCategory, TaskFrequency } from '@/types/task';
import { generateId } from '@/utils/helpers';
import { getCategoryIcon } from '@/utils/helpers';

export default function AddTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ petId?: string }>();
  const { pets } = usePetStore();
  const { addTask } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(params.petId || null);
  const [category, setCategory] = useState<TaskCategory>('feeding');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState<TaskFrequency>('once');
  const [notifyBefore, setNotifyBefore] = useState('15');
  
  const categories: TaskCategory[] = [
    'feeding', 
    'walking', 
    'grooming', 
    'medication', 
    'vet', 
    'training',
    'play',
    'cleaning',
    'other'
  ];
  
  const frequencies: { value: TaskFrequency; label: string }[] = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
  
  // Set current time as default (rounded to nearest 15 minutes)
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = Math.round(now.getMinutes() / 15) * 15;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = (minutes % 60).toString().padStart(2, '0');
    setTime(`${formattedHours}:${formattedMinutes}`);
  }, []);
  
  const handleAddTask = () => {
    if (!title.trim() || !selectedPetId) {
      // Show error (in a real app, use a proper error handling system)
      alert('Please enter a title and select a pet');
      return;
    }
    
    const newTask: Task = {
      id: generateId(),
      petId: selectedPetId,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      date,
      time: time || undefined,
      frequency,
      completed: false,
      notifyBefore: notifyBefore ? parseInt(notifyBefore, 10) : undefined,
    };
    
    addTask(newTask);
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Add Task' }} />
        
        {/* Task Information Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor={colors.textSecondary + '80'}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add task details (optional)"
              placeholderTextColor={colors.textSecondary + '80'}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pet *</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petsContainer}
            >
              {pets.map(pet => (
                <TouchableOpacity 
                  key={pet.id} 
                  style={[
                    styles.petItem,
                    selectedPetId === pet.id && styles.selectedPetItem,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <PetAvatar 
                    name={pet.name} 
                    species={pet.species} 
                    imageUri={pet.imageUri} 
                    size={60} 
                  />
                  <Text 
                    style={[
                      styles.petName,
                      selectedPetId === pet.id && styles.selectedPetName,
                    ]} 
                    numberOfLines={1}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Category</Text>
          
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  category === cat && styles.selectedCategoryItem,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
                <Text 
                  style={[
                    styles.categoryText,
                    category === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary + '80'}
            />
            <Text style={styles.inputHelp}>Format: YYYY-MM-DD</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Time (optional)</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor={colors.textSecondary + '80'}
            />
            <Text style={styles.inputHelp}>Format: HH:MM (24-hour)</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Frequency</Text>
            <View style={styles.frequencyOptions}>
              {frequencies.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyOption,
                    frequency === freq.value && styles.selectedFrequencyOption,
                  ]}
                  onPress={() => setFrequency(freq.value)}
                >
                  <Text 
                    style={[
                      styles.frequencyOptionText,
                      frequency === freq.value && styles.selectedFrequencyOptionText,
                    ]}
                  >
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notify Before (minutes)</Text>
            <TextInput
              style={styles.input}
              value={notifyBefore}
              onChangeText={(text) => setNotifyBefore(text.replace(/[^0-9]/g, ''))}
              placeholder="15"
              placeholderTextColor={colors.textSecondary + '80'}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Add Task"
            onPress={handleAddTask}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  inputHelp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  petsContainer: {
    paddingVertical: 8,
  },
  petItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
    padding: 4,
    borderRadius: 8,
  },
  selectedPetItem: {
    backgroundColor: colors.primary + '15', // 15% opacity
    borderWidth: 1,
    borderColor: colors.primary,
  },
  petName: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  selectedPetName: {
    color: colors.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary + '15', // 15% opacity
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.primary,
    fontWeight: '500',
  },
  frequencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  frequencyOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFrequencyOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyOptionText: {
    color: colors.text,
    fontWeight: '500',
  },
  selectedFrequencyOptionText: {
    color: 'white',
  },
  buttonContainer: {
    marginTop: 16,
  },
});
