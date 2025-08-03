import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../ui/Card';

interface SobrietyCounterProps {
  sobrietyStartDate: string;
}

export const SobrietyCounter: React.FC<SobrietyCounterProps> = ({
  sobrietyStartDate,
}) => {
  const daysSober = useMemo(() => {
    const startDate = new Date(sobrietyStartDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [sobrietyStartDate]);

  const getMotivationalMessage = (days: number) => {
    if (days < 7) return "Every day is a victory!";
    if (days < 30) return "You're building a strong foundation!";
    if (days < 90) return "Three months of strength!";
    if (days < 365) return "Nearly a year of courage!";
    return "You're an inspiration to others!";
  };

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Days Sober</Text>
        <Text style={styles.counter}>{daysSober}</Text>
        <Text style={styles.message}>
          {getMotivationalMessage(daysSober)}
        </Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{Math.floor(daysSober / 7)}</Text>
          <Text style={styles.statLabel}>Weeks</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{Math.floor(daysSober / 30)}</Text>
          <Text style={styles.statLabel}>Months</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{Math.floor(daysSober / 365)}</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  counter: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});