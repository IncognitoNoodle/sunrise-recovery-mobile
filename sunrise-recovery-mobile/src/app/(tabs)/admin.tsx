import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { AdminPost } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

export default function AdminScreen() {
  const { profile } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh posts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (profile?.role === 'admin') {
        loadPosts();
      }
    }, [profile])
  );

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      // Get all posts for admin management (including drafts)
      const { data, error } = await supabase
        .from('admin_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    router.push('/(screens)/create-post');
  };

  const handleUploadVideo = () => {
    Alert.alert('Coming Soon', 'Video upload feature will be available in the next update.');
  };

  const handleManageUsers = () => {
    Alert.alert('Coming Soon', 'User management feature will be available in the next update.');
  };

  const handleViewAllPosts = () => {
    Alert.alert('Coming Soon', 'View all posts feature will be available soon!');
  };

  const handleEditPost = (post: AdminPost) => {
    // Navigate to edit post screen
    router.push(`/(screens)/edit-post?id=${post.id}`);
  };

  const handleDeletePost = (post: AdminPost) => {
    Alert.alert(
      'Delete Post',
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteAdminPost(post.id);
              Alert.alert('Success', 'Post deleted successfully!');
              loadPosts(); // Refresh the posts list
            } catch (error) {
              console.error('Failed to delete post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (profile?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Ionicons name="lock-closed" size={48} color="#9ca3af" />
          <Text style={styles.unauthorizedTitle}>Access Denied</Text>
          <Text style={styles.unauthorizedText}>
            You don't have permission to access the admin panel.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>Manage content and users</Text>
        </View>

        <View style={styles.content}>
          <Card variant="elevated" padding="large" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Videos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated" padding="large" style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleCreatePost}>
              <View style={styles.actionIcon}>
                <Ionicons name="add-circle" size={24} color="#0ea5e9" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Create Post</Text>
                <Text style={styles.actionDescription}>
                  Share announcements, tips, or motivational content
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleUploadVideo}>
              <View style={styles.actionIcon}>
                <Ionicons name="videocam" size={24} color="#0ea5e9" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Upload Video</Text>
                <Text style={styles.actionDescription}>
                  Add new recovery-focused video content
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleManageUsers}>
              <View style={styles.actionIcon}>
                <Ionicons name="people" size={24} color="#0ea5e9" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Users</Text>
                <Text style={styles.actionDescription}>
                  View and manage user accounts
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Card>

          <Card variant="elevated" padding="large" style={styles.postsCard}>
            <View style={styles.postsHeader}>
              <Text style={styles.postsTitle}>Recent Posts</Text>
              {posts.length > 0 && (
                <TouchableOpacity onPress={handleViewAllPosts}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {isLoading ? (
              <Text style={styles.loadingText}>Loading posts...</Text>
            ) : posts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>Create your first post to get started</Text>
              </View>
            ) : (
              posts.slice(0, 3).map((post) => (
                <View key={post.id} style={styles.postItem}>
                  <View style={styles.postHeader}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: post.is_published ? '#059669' : '#f59e0b' }
                    ]}>
                      <Text style={styles.statusText}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postContent} numberOfLines={2}>
                    {post.content}
                  </Text>
                  <View style={styles.postFooter}>
                    <Text style={styles.postDate}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                    <View style={styles.postActions}>
                      <TouchableOpacity 
                        style={styles.postActionButton} 
                        onPress={() => handleEditPost(post)}
                      >
                        <Ionicons name="create-outline" size={16} color="#0ea5e9" />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.postActionButton, styles.deleteButton]} 
                        onPress={() => handleDeletePost(post)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#dc2626" />
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
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
  statsCard: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    fontSize: 24,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  postsCard: {
    marginBottom: 20,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  postItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  postContent: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthorizedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  postActions: {
    flexDirection: 'row',
    gap: 10,
  },
  postActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#fef3f2',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
});