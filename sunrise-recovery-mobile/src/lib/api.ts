import { supabase } from './supabase';
import { 
  Video, 
  AdminPost, 
  UserProgress, 
  UserFavorite, 
  UserWatchHistory,
  CreateVideo,
  CreateAdminPost,
  CreateUserProgress,
  CreateUserFavorite,
  CreateUserWatchHistory,
  UpdateProfile,
  UpdateVideo,
  UpdateAdminPost,
  UpdateUserProgress
} from '../types/supabase';

export const api = {
  // User Profile Management
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  updateUserProfile: async (userId: string, updates: UpdateProfile) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Video Management
  getVideos: async (category?: string) => {
    let query = supabase
      .from('videos')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  getVideo: async (videoId: string) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (error) throw error;
    return data;
  },

  createVideo: async (video: CreateVideo) => {
    const { data, error } = await supabase
      .from('videos')
      .insert(video)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateVideo: async (videoId: string, updates: UpdateVideo) => {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteVideo: async (videoId: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);
    
    if (error) throw error;
  },

  recordVideoView: async (videoId: string, userId: string) => {
    // Update view count
    const { error: viewError } = await supabase
      .from('videos')
      .update({ view_count: supabase.rpc('increment') })
      .eq('id', videoId);
    
    if (viewError) throw viewError;

    // Record watch history
    const { error: historyError } = await supabase
      .from('user_watch_history')
      .insert({
        user_id: userId,
        video_id: videoId,
        watch_duration: 0, // Will be updated when video ends
        completed: false,
      });
    
    if (historyError) throw historyError;
  },

  // Admin Posts Management
  getAdminPosts: async () => {
    const { data, error } = await supabase
      .from('admin_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getAdminPostById: async (postId: string) => {
    const { data, error } = await supabase
      .from('admin_posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (error) throw error;
    return data;
  },

  createAdminPost: async (post: CreateAdminPost) => {
    const { data, error } = await supabase
      .from('admin_posts')
      .insert(post)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateAdminPost: async (postId: string, updates: UpdateAdminPost) => {
    const { data, error } = await supabase
      .from('admin_posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteAdminPost: async (postId: string) => {
    const { error } = await supabase
      .from('admin_posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
  },

  // User Progress Management
  getUserProgress: async (userId: string, date: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  createUserProgress: async (progress: CreateUserProgress) => {
    const { data, error } = await supabase
      .from('user_progress')
      .insert(progress)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateUserProgress: async (userId: string, date: string, updates: UpdateUserProgress) => {
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .eq('date', date)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // User Favorites Management
  getUserFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('video_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map(fav => fav.video_id);
  },

  toggleFavorite: async (userId: string, videoId: string) => {
    // Check if already favorited
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('video_id', videoId);
      
      if (error) throw error;
      return false; // Removed
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          video_id: videoId,
        });
      
      if (error) throw error;
      return true; // Added
    }
  },

  // User Watch History Management
  getUserWatchHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('watched_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  updateWatchHistory: async (userId: string, videoId: string, duration: number, completed: boolean) => {
    const { error } = await supabase
      .from('user_watch_history')
      .update({
        watch_duration: duration,
        completed,
        watched_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('video_id', videoId);
    
    if (error) throw error;
  },

  // File Upload
  uploadFile: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, file);
    
    if (error) throw error;
    return data;
  },

  getFileUrl: (path: string) => {
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
};