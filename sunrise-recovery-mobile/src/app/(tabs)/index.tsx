import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { SobrietyCounter } from '../../components/features/dashboard/SobrietyCounter';
import { DailyCheckIn } from '../../components/features/dashboard/DailyCheckIn';
import { AdminAnnouncements } from '../../components/features/dashboard/AdminAnnouncements';

export default function DashboardScreen() {
  const { profile } = useAuthStore();

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Profile not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome back, {profile.full_name}!
          </Text>
          <Text style={styles.subtitle}>
            Keep up the great work on your recovery journey
          </Text>
        </View>

        <View style={styles.content}>
          <SobrietyCounter sobrietyStartDate={profile.sobriety_start_date} />
          
          <DailyCheckIn />
          
          <AdminAnnouncements />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 50,
  },
});