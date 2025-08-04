import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Ionicons } from '@expo/vector-icons';

interface SobrietyCounterProps {
  sobrietyStartDate: string;
}

export const SobrietyCounter: React.FC<SobrietyCounterProps> = ({
  sobrietyStartDate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
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

  const handleTap = () => {
    setShowDetails(true);
  };

  const handleLongPress = () => {
    Alert.alert(
      'Reset Sobriety Date',
      'Are you sure you want to reset your sobriety start date? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement reset functionality
            Alert.alert('Coming Soon', 'This feature will be available soon.');
          }
        },
      ]
    );
  };

  const getDetailedStats = () => {
    const startDate = new Date(sobrietyStartDate);
    const today = new Date();
    const weeks = Math.floor(daysSober / 7);
    const months = Math.floor(daysSober / 30.44);
    const years = Math.floor(daysSober / 365.25);
    const hours = daysSober * 24;
    const minutes = hours * 60;

    return {
      startDate: startDate.toLocaleDateString(),
      days: daysSober,
      weeks,
      months,
      years,
      hours,
      minutes
    };
  };

  return (
    <>
      <TouchableOpacity onPress={handleTap} onLongPress={handleLongPress}>
        <Card variant="elevated" padding="large" style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.label}>Days Sober</Text>
            <Text style={styles.counter}>{daysSober}</Text>
            <Text style={styles.message}>
              {getMotivationalMessage(daysSober)}
            </Text>
            <View style={styles.tapHint}>
              <Ionicons name="information-circle-outline" size={16} color="#2772AA" />
              <Text style={styles.tapHintText}>Tap for details</Text>
            </View>
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
      </TouchableOpacity>

      <Modal
        visible={showDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sobriety Details</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <Ionicons name="close" size={24} color="#494949" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailsContent}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Start Date:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().startDate}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Days:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().days}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weeks:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().weeks}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Months:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().months}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Years:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().years}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Hours:</Text>
                <Text style={styles.detailValue}>{getDetailedStats().hours.toLocaleString()}</Text>
              </View>
            </View>
            
            <Button
              title="Close"
              onPress={() => setShowDetails(false)}
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </>
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
    fontSize: 18,
    color: '#494949',
    marginBottom: 8,
    fontWeight: '600',
  },
  counter: {
    fontSize: 56,
    fontWeight: '700',
    color: '#2772AA',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#494949',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
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
    fontSize: 28,
    fontWeight: '600',
    color: '#2772AA',
  },
  statLabel: {
    fontSize: 12,
    color: '#494949',
    marginTop: 4,
    fontWeight: '500',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tapHintText: {
    fontSize: 12,
    color: '#2772AA',
    marginLeft: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2772AA',
  },
  detailsContent: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#494949',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2772AA',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 8,
  },
});