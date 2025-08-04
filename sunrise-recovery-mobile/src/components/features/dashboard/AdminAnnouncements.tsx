import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../ui/Card';
import { api } from '../../../lib/api';
import { AdminPost } from '../../../types/supabase';

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      const posts = await api.getAdminPosts();
      setAnnouncements(posts.slice(0, 3)); // Show only latest 3
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#FEC18A';
      case 'low': return '#ABCA87';
      default: return '#494949';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'motivational': return '💪';
      case 'event': return '📅';
      case 'tip': return '💡';
      default: return '📝';
    }
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="large" style={styles.container}>
        <Text style={styles.title}>Announcements</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </Card>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card variant="elevated" padding="large" style={styles.container}>
        <Text style={styles.title}>Announcements</Text>
        <Text style={styles.emptyText}>No announcements at the moment.</Text>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.announcementItem}>
            <View style={styles.announcementHeader}>
              <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
              <View style={styles.headerContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <View style={styles.metaInfo}>
                  <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(item.priority) }
                  ]}>
                    <Text style={styles.priorityText}>{item.priority}</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.announcementContent}>{item.content}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
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
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#494949',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#494949',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  announcementItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  announcementHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2772AA',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#494949',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  announcementContent: {
    fontSize: 14,
    color: '#494949',
    lineHeight: 20,
  },
});