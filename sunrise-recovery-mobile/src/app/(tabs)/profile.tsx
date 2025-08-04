import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
  const { profile, user, logout, updateProfile } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: profile?.full_name || '',
    sobriety_start_date: profile?.sobriety_start_date || '',
  });

  // Update editedProfile when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name,
        sobriety_start_date: profile.sobriety_start_date,
      });
    }
  }, [profile]);

  const handleEdit = () => {
    // Reset form to current profile values
    setEditedProfile({
      full_name: profile?.full_name || '',
      sobriety_start_date: profile?.sobriety_start_date || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedProfile({
      full_name: profile?.full_name || '',
      sobriety_start_date: profile?.sobriety_start_date || '',
    });
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile({
        full_name: editedProfile.full_name,
        sobriety_start_date: editedProfile.sobriety_start_date,
      });
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              // Even if logout fails, redirect to login
              router.replace('/(auth)/login');
            }
          }
        },
      ]
    );
  };

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
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        <View style={styles.content}>
          <Card variant="elevated" padding="large" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="#ffffff" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.full_name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEdit}
              >
                <Ionicons name="pencil" size={20} color="#2772AA" />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <Input
                  label="Full Name"
                  value={editedProfile.full_name}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, full_name: text }))}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Sobriety Start Date"
                  value={editedProfile.sobriety_start_date}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, sobriety_start_date: text }))}
                  placeholder="YYYY-MM-DD"
                  helper="The date you started your recovery journey"
                />
                <View style={styles.editActions}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    size="small"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                  />
                  <Button
                    title="Save"
                    size="small"
                    onPress={handleSaveProfile}
                    style={styles.saveButton}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.profileDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sobriety Start Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(profile.sobriety_start_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Account Type:</Text>
                  <Text style={styles.detailValue}>
                    {profile.role === 'admin' ? 'Administrator' : 'User'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Member Since:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(profile.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </Card>

          <Card variant="elevated" padding="large" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Recovery Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.ceil((new Date().getTime() - new Date(profile.sobriety_start_date).getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text style={styles.statLabel}>Days Sober</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.floor((new Date().getTime() - new Date(profile.sobriety_start_date).getTime()) / (1000 * 60 * 60 * 24 * 7))}
                </Text>
                <Text style={styles.statLabel}>Weeks</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.floor((new Date().getTime() - new Date(profile.sobriety_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                </Text>
                <Text style={styles.statLabel}>Months</Text>
              </View>
            </View>
          </Card>

          <Card variant="outlined" padding="medium" style={styles.logoutCard}>
            <Text style={styles.logoutText}>Need to take a break?</Text>
            <Button
              title="Sign Out"
              variant="outline"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </Card>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2772AA',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#494949',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2772AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2772AA',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#494949',
  },
  editButton: {
    padding: 8,
  },
  editForm: {
    marginTop: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  saveButton: {
    minWidth: 80,
  },
  profileDetails: {
    marginTop: 16,
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
  },
  detailValue: {
    fontSize: 14,
    color: '#2772AA',
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2772AA',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2772AA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#494949',
    fontWeight: '500',
  },
  logoutCard: {
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    color: '#494949',
    marginBottom: 12,
  },
  logoutButton: {
    minWidth: 120,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 50,
  },
});