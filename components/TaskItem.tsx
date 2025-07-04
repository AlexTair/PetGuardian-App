import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/types/task';
import { colors } from '@/constants/colors';
import { formatTime, getRelativeTimeString } from '@/utils/dateUtils';
import { getCategoryIcon } from '@/utils/helpers';
import { Check, Circle } from 'lucide-react-native';

interface TaskItemProps {
  task: Task;
  petName?: string;
  onToggle: (id: string) => void;
  onPress?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  petName,
  onToggle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        task.completed && styles.completedContainer,
      ]}
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {task.completed ? (
          <Check size={20} color={colors.success} />
        ) : (
          <Circle size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          <Text style={styles.category}>
            {getCategoryIcon(task.category)}
          </Text>
        </View>
        
        {task.description && (
          <Text 
            style={[styles.description, task.completed && styles.completedText]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          {petName && (
            <Text style={styles.petName}>{petName}</Text>
          )}
          
          <View style={styles.timeContainer}>
            <Text style={styles.date}>
              {getRelativeTimeString(task.date)}
            </Text>
            {task.time && (
              <Text style={styles.time}>
                {formatTime(task.time)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: colors.card,
  },
  checkbox: {
    marginRight: 12,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  category: {
    fontSize: 16,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  petName: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});
