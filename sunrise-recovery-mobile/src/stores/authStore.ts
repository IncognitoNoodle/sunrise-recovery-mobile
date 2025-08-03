import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, CreateProfile } from '../types/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profile: CreateProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        set({
          user: data.user,
          session: data.session,
          profile,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  signup: async (email: string, password: string, profile: CreateProfile) => {
    try {
      set({ isLoading: true, error: null });
      
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            // Add any additional user metadata here
            full_name: profile.full_name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            ...profile,
            id: data.user.id,
          });

        if (profileError) {
          throw profileError;
        }

        // Set the user as logged in immediately
        set({
          user: data.user,
          session: data.session,
          profile: { ...profile, id: data.user.id } as Profile,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error) {
      // Even if logout fails, clear the local state
      set({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local profile state
      const { profile } = get();
      if (profile) {
        set({ profile: { ...profile, ...updates } });
      }
    } catch (error) {
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    const { isInitialized } = get();
    if (isInitialized) {
      return;
    }

    try {
      set({ isLoading: true });
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        set({ isLoading: false, isInitialized: true });
        return;
      }
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          set({ isLoading: false, isInitialized: true });
          return;
        }

        set({
          user: session.user,
          session,
          profile,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({ isLoading: false, isInitialized: true });
      }
    } catch (error) {
      set({ isLoading: false, isInitialized: true });
    }
  },
}));

// Set up auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // Fetch profile for signed in user
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    useAuthStore.setState({
      user: session.user,
      session,
      profile,
      isLoading: false,
    });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      error: null,
    });
  } else if (event === 'TOKEN_REFRESHED' && session?.user) {
    // Update session on token refresh
    useAuthStore.setState({
      session,
    });
  }
});