import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminPostForm } from '../../components/forms/AdminPostForm';

export default function CreatePostScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to admin panel after successful post creation
    router.back();
  };

  const handleCancel = () => {
    // Navigate back to admin panel
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Create New Post</Text>
          <Text style={styles.subtitle}>Share content with your community</Text>
        </View>
      </View>
      
      <AdminPostForm 
        onSuccess={handleSuccess} 
        onCancel={handleCancel}
        isScreenMode={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2772AA',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#494949',
    textAlign: 'center',
  },
}); 