import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { VideoCategories } from '../../components/features/videos/VideoCategories';
import { VideoPlayer } from '../../components/features/videos/VideoPlayer';
import { VideoThumbnail } from '../../components/features/videos/VideoThumbnail';
import { api } from '../../lib/api';
import { getVideosByCategory } from '../../lib/sampleVideos';
import { Video } from '../../types/supabase';

const categories = [
  { id: 'all', name: 'All Videos', icon: 'play-circle' },
  { id: 'coping', name: 'Coping Skills', icon: 'heart' },
  { id: 'coach-tips', name: 'Coach Tips', icon: 'bulb' },
  { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf' },
  { id: 'motivation', name: 'Motivation', icon: 'trending-up' },
  { id: 'education', name: 'Education', icon: 'school' },
];

export default function VideosScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      // For now, use sample data instead of API call
      const videoData = getVideosByCategory(selectedCategory === 'all' ? undefined : selectedCategory);
      setVideos(videoData as Video[]);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => {
        setSelectedVideo(item);
        setIsVideoPlayerVisible(true);
      }}
    >
      <Card variant="default" padding="none" style={styles.videoCard}>
        <VideoThumbnail
          thumbnailUrl={item.thumbnail_url}
          duration={item.duration}
          title={item.title}
        />
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.videoMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Video Library</Text>
          <Text style={styles.subtitle}>
            Discover recovery-focused content to support your journey
          </Text>
        </View>

        <VideoCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.videosSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Videos' : categories.find(c => c.id === selectedCategory)?.name}
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading videos...</Text>
            </View>
          ) : videos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="play-circle-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No videos available</Text>
              <Text style={styles.emptySubtext}>Check back later for new content</Text>
            </View>
          ) : (
            <FlatList
              data={videos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.videosList}
            />
          )}
        </View>
      </ScrollView>
      
      <VideoPlayer
        video={selectedVideo}
        isVisible={isVideoPlayerVisible}
        onClose={() => {
          setIsVideoPlayerVisible(false);
          setSelectedVideo(null);
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
  videosSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  videoItem: {
    marginBottom: 16,
  },
  videoCard: {
    overflow: 'hidden',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
  videosList: {
    paddingBottom: 20,
  },
});