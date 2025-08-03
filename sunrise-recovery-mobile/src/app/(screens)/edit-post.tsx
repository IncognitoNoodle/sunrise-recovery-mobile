import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AdminPostForm } from '../../components/forms/AdminPostForm';
import { api } from '../../lib/api';
import { AdminPost } from '../../types/supabase';

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<AdminPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const postData = await api.getAdminPostById(id);
      setPost(postData);
    } catch (error) {
      console.error('Failed to load post:', error);
      Alert.alert('Error', 'Failed to load post');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    Alert.alert('Success', 'Post updated successfully!');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Post Not Found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Edit Post</Text>
          <Text style={styles.subtitle}>Update your post content</Text>
        </View>
      </View>
      
      <AdminPostForm 
        onSuccess={handleSuccess} 
        onCancel={handleCancel}
        isScreenMode={true}
        isEditMode={true}
        postId={id}
        initialData={{
          title: post.title,
          content: post.content,
          type: post.type,
          priority: post.priority,
          is_published: post.is_published,
          expires_at: post.expires_at ? new Date(post.expires_at).toISOString().split('T')[0] : '',
        }}
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
}); 