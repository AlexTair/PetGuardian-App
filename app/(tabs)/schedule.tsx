import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/hooks/useTaskStore';
import { usePetStore } from '@/hooks/usePetStore';
import { colors } from '@/constants/colors';
import { TaskItem } from '@/components/TaskItem';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, getDayName } from '@/utils/dateUtils';
import { Calendar, Plus, AlertCircle } from 'lucide-react-native';

export default function ScheduleScreen() {
  const router = useRouter();
  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { pets } = usePetStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);

  // Generate dates for the date picker (2 weeks)
  useEffect(() => {
    const today = new Date();
    const dateArray: Date[] = [];
    
    for (let i = -3; i < 11; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    
    setDates(dateArray);
  }, []);

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : '';
  };

  const getTasksForSelectedDate = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = new Date(task.date).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const handleAddTask = () => {
    router.push('/task/add');
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filteredTasks = getTasksForSelectedDate();
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <View style={styles.datePickerContainer}>
        <FlatList
          horizontal
          data={dates}
          keyExtractor={(item) => item.toISOString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                selectedDate.toDateString() === item.toDateString() && styles.selectedDateItem,
              ]}
              onPress={() => setSelectedDate(item)}
            >
              <Text style={styles.dayName}>{getDayName(item).slice(0, 3)}</Text>
              <Text 
                style={[
                  styles.dateNumber,
                  selectedDate.toDateString() === item.toDateString() && styles.selectedDateText,
                  isToday(item) && styles.todayText,
                ]}
              >
                {item.getDate()}
              </Text>
              {isToday(item) && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datePickerContent}
        />
      </View>

      <View style={styles.content}>
        {/* Date Header */}
        <View style={styles.dateHeader}>
          <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
          <Text style={styles.taskCount}>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <FlatList
            data={[...pendingTasks, ...completedTasks]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                petName={getPetName(item.petId)}
                onToggle={toggleTaskCompletion}
                onPress={(task) => router.push(`/task/${task.id}`)}
              />
            )}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title="No Tasks Scheduled"
            message={`You don't have any tasks scheduled for ${formatDate(selectedDate)}`}
            actionLabel="Add Task"
            onAction={handleAddTask}
            icon={<Calendar size={40} color={colors.primary} />}
          />
        )}
      </View>

      <View style={styles.fabContainer}>
        <Button
          title="Add Task"
          onPress={handleAddTask}
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
  datePickerContainer: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  datePickerContent: {
    paddingHorizontal: 8,
  },
  dateItem: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  selectedDateItem: {
    backgroundColor: colors.primary + '15', // 15% opacity
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDateText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  todayText: {
    color: colors.primary,
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  taskList: {
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
