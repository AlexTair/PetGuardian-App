import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { usePetStore } from '@/hooks/usePetStore';
import { useTaskStore } from '@/hooks/useTaskStore';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TaskItem } from '@/components/TaskItem';
import { formatDate } from '@/utils/dateUtils';
import { 
  Calendar, 
  Clipboard, 
  Edit, 
  Trash2, 
  Plus, 
  AlertCircle,
  Syringe,
  Stethoscope,
  AlertTriangle,
  Phone
} from 'lucide-react-native';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getPet, deletePet } = usePetStore();
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'tasks'>('info');
  
  const pet = getPet(id);
  
  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  const petTasks = tasks.filter(task => task.petId === pet.id);
  const upcomingTasks = petTasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const handleDeletePet = () => {
    deletePet(pet.id);
    router.replace('/pets');
  };

  const handleEditPet = () => {
    // Navigate to edit pet screen (not implemented in this example)
    console.log('Edit pet:', pet.id);
  };

  const handleAddTask = () => {
    router.push({
      pathname: '/task/add',
      params: { petId: pet.id }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen 
        options={{
          title: pet.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleEditPet} style={{ marginRight: 16 }}>
              <Edit size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Pet Header */}
      <View style={styles.header}>
        {pet.imageUri ? (
          <Image source={{ uri: pet.imageUri }} style={styles.petImage} />
        ) : (
          <View style={styles.petImagePlaceholder}>
            <Text style={styles.petImagePlaceholderText}>
              {pet.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>
            {pet.breed || pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </Text>
          
          {(pet.age || pet.birthdate) && (
            <Text style={styles.petAge}>
              {pet.age ? `${pet.age} years old` : 
                pet.birthdate ? `Born: ${formatDate(pet.birthdate)}` : ''}
            </Text>
          )}
          
          {pet.gender && (
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>
                  {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                </Text>
              </View>
              
              {pet.neutered && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Neutered</Text>
                </View>
              )}
              
              {pet.microchipped && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Microchipped</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Info
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'health' && styles.activeTab]}
          onPress={() => setActiveTab('health')}
        >
          <Text style={[styles.tabText, activeTab === 'health' && styles.activeTabText]}>
            Health
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
            Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <View style={styles.tabContent}>
          {/* Notes */}
          {pet.notes && (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Notes</Text>
                <Clipboard size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.notesText}>{pet.notes}</Text>
            </Card>
          )}
          
          {/* Feeding Schedule */}
          {pet.feedingSchedules && pet.feedingSchedules.length > 0 && (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Feeding Schedule</Text>
              </View>
              
              {pet.feedingSchedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleTime}>
                    <Text style={styles.scheduleTimeText}>{schedule.time}</Text>
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTitle}>{schedule.portion}</Text>
                    <Text style={styles.scheduleDescription}>{schedule.foodType}</Text>
                    {schedule.notes && (
                      <Text style={styles.scheduleNotes}>{schedule.notes}</Text>
                    )}
                  </View>
                </View>
              ))}
            </Card>
          )}
          
          {/* Contacts */}
          {pet.contacts && pet.contacts.length > 0 && (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Contacts</Text>
              </View>
              
              {pet.contacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Phone size={18} color={colors.primary} />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>
                      {contact.role.charAt(0).toUpperCase() + contact.role.slice(1)}
                    </Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                    {contact.email && (
                      <Text style={styles.contactEmail}>{contact.email}</Text>
                    )}
                  </View>
                </View>
              ))}
            </Card>
          )}
          
          <Button
            title="Delete Pet"
            onPress={handleDeletePet}
            variant="outline"
            style={styles.deleteButton}
            textStyle={{ color: colors.error }}
            icon={<Trash2 size={18} color={colors.error} />}
          />
        </View>
      )}

      {activeTab === 'health' && (
        <View style={styles.tabContent}>
          {/* Vaccinations */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Vaccinations</Text>
              <Syringe size={18} color={colors.textSecondary} />
            </View>
            
            {pet.vaccinations && pet.vaccinations.length > 0 ? (
              pet.vaccinations.map((vaccination) => (
                <View key={vaccination.id} style={styles.vaccinationItem}>
                  <View style={styles.vaccinationHeader}>
                    <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                    <Text style={styles.vaccinationDate}>{formatDate(vaccination.date)}</Text>
                  </View>
                  <Text style={styles.vaccinationExpiry}>
                    Expires: {formatDate(vaccination.expiryDate)}
                  </Text>
                  {vaccination.notes && (
                    <Text style={styles.vaccinationNotes}>{vaccination.notes}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No vaccinations recorded</Text>
            )}
            
            <Button
              title="Add Vaccination"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.addButton}
              icon={<Plus size={16} color={colors.primary} />}
            />
          </Card>
          
          {/* Medical Records */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Medical Records</Text>
              <Stethoscope size={18} color={colors.textSecondary} />
            </View>
            
            {pet.medicalRecords && pet.medicalRecords.length > 0 ? (
              pet.medicalRecords.map((record) => (
                <View key={record.id} style={styles.medicalItem}>
                  <View style={styles.medicalHeader}>
                    <View style={styles.medicalType}>
                      <Text style={styles.medicalTypeText}>
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.medicalDate}>{formatDate(record.date)}</Text>
                  </View>
                  <Text style={styles.medicalDescription}>{record.description}</Text>
                  {record.vetName && (
                    <Text style={styles.medicalVet}>Vet: {record.vetName}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No medical records</Text>
            )}
            
            <Button
              title="Add Medical Record"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.addButton}
              icon={<Plus size={16} color={colors.primary} />}
            />
          </Card>
          
          {/* Allergies */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Allergies</Text>
              <AlertTriangle size={18} color={colors.textSecondary} />
            </View>
            
            {pet.allergies && pet.allergies.length > 0 ? (
              <View style={styles.allergiesContainer}>
                {pet.allergies.map((allergy, index) => (
                  <View key={index} style={styles.allergyTag}>
                    <Text style={styles.allergyText}>{allergy}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No allergies recorded</Text>
            )}
            
            <Button
              title="Add Allergy"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.addButton}
              icon={<Plus size={16} color={colors.primary} />}
            />
          </Card>
        </View>
      )}

      {activeTab === 'tasks' && (
        <View style={styles.tabContent}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksTitle}>Upcoming Tasks</Text>
            <Button
              title="Add Task"
              onPress={handleAddTask}
              variant="outline"
              size="small"
              icon={<Plus size={16} color={colors.primary} />}
            />
          </View>
          
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTaskCompletion}
                onPress={(task) => router.push(`/task/${task.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyTasksContainer}>
              <AlertCircle size={40} color={colors.primary} />
              <Text style={styles.emptyTasksTitle}>No Upcoming Tasks</Text>
              <Text style={styles.emptyTasksMessage}>
                Add tasks to keep track of {pet.name}'s care routine
              </Text>
              <Button
                title="Add Task"
                onPress={handleAddTask}
                style={styles.emptyTasksButton}
              />
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.viewAllContainer}
            onPress={() => router.push('/schedule')}
          >
            <Text style={styles.viewAllText}>View All Tasks</Text>
            <Calendar size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
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
    flexDirection: 'row',
    marginBottom: 24,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  petImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petImagePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  petInfo: {
    marginLeft: 16,
    flex: 1,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  petAge: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleTime: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  scheduleTimeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  scheduleDetails: {
    marginLeft: 12,
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  scheduleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scheduleNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  contactRole: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginTop: 16,
    borderColor: colors.error,
  },
  vaccinationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaccinationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  vaccinationDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vaccinationExpiry: {
    fontSize: 14,
    color: colors.warning,
    marginTop: 4,
  },
  vaccinationNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  medicalItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  medicalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicalType: {
    backgroundColor: colors.primary + '15', // 15% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  medicalTypeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  medicalDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  medicalDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  medicalVet: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  allergyTag: {
    backgroundColor: colors.warning + '15', // 15% opacity
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyText: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyTasksContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyTasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTasksMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyTasksButton: {
    minWidth: 150,
  },
  viewAllContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
});
