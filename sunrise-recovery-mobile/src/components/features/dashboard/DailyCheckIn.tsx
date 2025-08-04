import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../lib/api';

export const DailyCheckIn: React.FC = () => {
  const { user } = useAuthStore();
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const moodOptions = [
    { value: 1, label: '😢', description: 'Very Low' },
    { value: 2, label: '😕', description: 'Low' },
    { value: 3, label: '😐', description: 'Okay' },
    { value: 4, label: '🙂', description: 'Good' },
    { value: 5, label: '😊', description: 'Great' },
  ];

  // Check if user has already checked in today
  useEffect(() => {
    const checkTodayStatus = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const existingCheckIn = await api.getUserProgress(user.id, today);
        
        if (existingCheckIn && existingCheckIn.check_in_completed) {
          setTodayCheckIn(existingCheckIn);
          setMood(existingCheckIn.mood);
          setNotes(existingCheckIn.notes || '');
        }
      } catch (error) {
        // If no check-in exists, that's fine - user can check in
        // No need to log this as it's expected behavior
      } finally {
        setIsLoading(false);
      }
    };

    checkTodayStatus();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !mood) return;

    try {
      setIsSubmitting(true);
      const today = new Date().toISOString().split('T')[0];
      
      if (todayCheckIn) {
        // Update existing check-in
        await api.updateUserProgress(user.id, today, {
          mood,
          check_in_completed: true,
          notes: notes.trim() || null,
        });
      } else {
        // Create new check-in
        await api.createUserProgress({
          user_id: user.id,
          date: today,
          sobriety_days: 0, // Will be calculated by the database
          mood,
          check_in_completed: true,
          notes: notes.trim() || null,
        });
      }

      // Refresh the check-in data
      const updatedCheckIn = await api.getUserProgress(user.id, today);
      setTodayCheckIn(updatedCheckIn);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original values
    setMood(todayCheckIn?.mood || null);
    setNotes(todayCheckIn?.notes || '');
    setIsEditing(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="large" style={styles.container}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Loading check-in status...</Text>
        </View>
      </Card>
    );
  }

  // Show completion state when not editing
  if (todayCheckIn && !isEditing) {
    const moodEmoji = moodOptions.find(option => option.value === todayCheckIn.mood)?.label || '😊';
    const moodDescription = moodOptions.find(option => option.value === todayCheckIn.mood)?.description || 'Unknown';
    
    return (
      <Card variant="elevated" padding="large" style={styles.container}>
        <View style={styles.completedContent}>
          <Text style={styles.completedTitle}>✅ Daily Check-in</Text>
          <Text style={styles.completedMessage}>
            Last updated at {formatTime(todayCheckIn.updated_at)}
          </Text>
          
          <View style={styles.moodDisplay}>
            <Text style={styles.moodEmoji}>{moodEmoji}</Text>
            <Text style={styles.moodText}>
              Your mood: {moodDescription}
            </Text>
          </View>
          
          {todayCheckIn.notes && (
            <Text style={styles.notesText}>"{todayCheckIn.notes}"</Text>
          )}
          
          <Button
            title="Update Check-in"
            variant="outline"
            onPress={handleEdit}
            style={styles.updateButton}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      <Text style={styles.title}>
        {todayCheckIn ? 'Update Daily Check-in' : 'Daily Check-in'}
      </Text>
      <Text style={styles.subtitle}>
        {todayCheckIn 
          ? 'How are you feeling now?' 
          : 'How are you feeling today?'
        }
      </Text>

      <View style={styles.moodContainer}>
        {moodOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.moodOption,
              mood === option.value && styles.moodOptionSelected,
            ]}
            onPress={() => setMood(option.value)}
          >
            <Text style={styles.moodEmoji}>{option.label}</Text>
            <Text style={styles.moodDescription}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Notes (Optional)"
        placeholder="How was your day? Any challenges or victories?"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={6}
        style={styles.notesInput}
      />

      <View style={styles.buttonContainer}>
        {todayCheckIn && (
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
        )}
        <Button
          title={todayCheckIn ? "Update Check-in" : "Submit Check-in"}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!mood}
          style={styles.submitButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2772AA',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#494949',
    marginBottom: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  moodOptionSelected: {
    borderColor: '#2772AA',
    backgroundColor: '#eff6ff',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 10,
    color: '#494949',
    textAlign: 'center',
    fontWeight: '500',
  },
  notesInput: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  completedContent: {
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ABCA87',
    marginBottom: 8,
  },
  completedMessage: {
    fontSize: 14,
    color: '#494949',
    textAlign: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#494949',
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  moodText: {
    fontSize: 14,
    color: '#494949',
    marginLeft: 5,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: '#494949',
    fontStyle: 'italic',
    marginTop: 10,
  },
  updateButton: {
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
});