# Sunrise Recovery App (Prototype)

The **Sunrise Recovery App** is a secure digital platform designed to support individuals in substance use recovery. This prototype includes foundational features that prioritize ease of use, privacy, and clinically aligned workflows for future integration.

This is an early build to demonstrate and validate core flows: user onboarding, motivational video content, and admin-to-user communication.

---

## Overview

The goal of this prototype is to establish a reliable baseline for:

- **User authentication and profile management**
- **Personalized dashboard with daily recovery tracking**
- **Staff-curated motivational video library**
- **Admin interface for pushing announcements and content**

All components are designed to be modular and HIPAA/SOC 2 compliant when deployed in a production environment.

---

## Tech Stack (Prototype)

| Layer            | Technology                               | Purpose                               |
|------------------|-------------------------------------------|----------------------------------------|
| Frontend         | React Native with Expo                    | Core UI and routing                    |
| Styling          | NativeWind (Tailwind CSS)                | Utility-first, responsive design       |
| Auth             | Supabase Auth                             | Secure user onboarding and sessions    |
| Database         | Supabase Postgres                         | User and content data                  |
| Media Hosting    | Supabase Storage                          | Video upload and playback              |
| Admin CMS        | Supabase Studio                           | Internal content management            |
| Hosting          | Vercel or Netlify                         | Fast deployment and CDN delivery       |

---

## Core Features

### 1. User Authentication & Profile

Secure sign-up and login experience that enables personalized content.

**Features:**

- Email and password auth
- User profile includes:
  - Full name
  - Sobriety start date
  - Interest tags (e.g. mindfulness, fitness)

**Flow:**

- User signs up or logs in  
- Dashboard displays personalized stats like "X days sober"  
- Preferences shape visible content over time  

---

### 2. Motivational Video Library

Recovery-focused short videos available within the app interface.

**Features:**

- Video categories (e.g., Coping, Coach Tips, Mindfulness)
- Playback within app
- (Future) Bookmark/favorite system  

**Flow:**

- User browses or filters videos  
- Plays selected content  
- Returns anytime for replay or updates  

---

### 3. Daily Check-in System

Personalized mood tracking and daily reflection system.

**Features:**

- **Mood tracking** with 5-level emoji-based scale (Very Low to Great)
- **Multiple check-ins per day** - Users can update their mood throughout the day
- **Notes and reflection** - Optional text input for daily thoughts
- **Last updated timestamp** - Shows when the check-in was last modified
- **Update existing entries** - No duplicate records, updates existing check-in
- **Persistent state** - Maintains check-in status across app sessions

**Flow:**

- User sees current mood status or check-in form
- Can submit initial check-in or update existing one
- Shows completion state with mood emoji and notes
- "Update Check-in" button allows mood changes throughout the day
- Timestamp shows last modification time

**Best Practices:**

- ✅ **One record per day** - Updates existing entry instead of creating duplicates
- ✅ **Mood flexibility** - Users can change mood as day progresses
- ✅ **Time awareness** - Shows when last updated
- ✅ **Data preservation** - Keeps existing notes when updating
- ✅ **Error handling** - Graceful error messages and retry options

---

### 4. Admin Communication Panel

Staff-facing UI for managing content and communicating with users.

**Features:**

- **Create Posts**: Full-screen form with comprehensive validation
  - Post types (Announcement, Motivational, Event, Tip)
  - Priority levels (Low, Medium, High)
  - Publish/draft status management
  - Optional expiration dates
- **Edit Posts**: Update existing posts with pre-filled forms
- **Delete Posts**: Permanent deletion with confirmation dialogs
- **View All Posts**: Recent posts section with status indicators
- **Post Management**: Complete CRUD operations for admin posts
- **Status Tracking**: Published/Draft status badges
- **Action Buttons**: Edit and delete actions for each post
- **Auto-refresh**: Posts list updates after actions

**Flow:**

- Admin logs into dashboard
- Views recent posts with status and actions
- Creates new posts via dedicated screen
- Edits existing posts with pre-filled data
- Deletes posts with confirmation
- All changes sync across user dashboards

---

## Running Locally

1. **Clone the Repository**

```bash
git clone https://github.com/your-org/sunrise-recovery-app.git
cd sunrise-recovery-mobile
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment**

Create a `.env` file in the project root with your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Set up Supabase Database**

Follow the database setup guide in `SETUP_DATABASE.md` or run the SQL commands in `database-schema.sql` in your Supabase SQL Editor.

5. **Run the App**

```bash
npx expo start --tunnel
```

Visit the provided URL or scan the QR code with Expo Go.

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys from Settings > API

### 2. Run Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `database-schema.sql`
4. Run the SQL commands

### 3. Configure RLS Policies

The schema includes all necessary Row Level Security (RLS) policies:

- **Profiles**: Users can view, update, and insert their own profile
- **Videos**: Anyone can view published videos, admins can manage all
- **Admin Posts**: Users can view published posts, admins can manage all
- **User Progress**: Users can manage their own progress data
- **User Favorites**: Users can manage their own favorites
- **User Watch History**: Users can manage their own watch history

### 4. Test the Setup

After running the schema, you should be able to:
- Sign up with a new account
- Log in with existing credentials
- Access the dashboard and other features

---

## Feature Scope (Prototype)

| Feature                         | Status   |
|----------------------------------|----------|
| User login + profile setup       | ✅ Ready |
| Motivational video playback      | ✅ Ready |
| Admin content publishing         | ✅ Ready |
| Personalized dashboard           | ✅ Ready |
| Daily journaling + check-ins     | 🔜 Planned |
| AI-assisted insights             | 🔜 Planned |
| Peer-to-peer messaging           | 🔜 Planned |

---

## Next Steps

This prototype is the foundation for broader behavioral engagement tools. Upcoming phases will focus on:

- Secure journaling and recovery habit tracking  
- Peer support and group features  
- Integration with licensed staff tools  
- Alerting and relapse prevention workflows

---

## Development Standards

### Core Principles

**Code Quality:**
- Well-structured and modular (no spaghetti code)
- Follows modern design patterns and clean architecture
- Refactored and DRY (no repetition, reusable logic)
- Includes meaningful comments and readable naming conventions
- Scalable and easy to maintain
- Avoid overly simplistic, demo-style implementations

**Security:**
- Secure (no known vulnerabilities, safe input handling, no hardcoded secrets)
- Follows OWASP top 10 guidelines (for web security)
- HIPAA/SOC 2 compliant practices (for healthcare apps)
- Proper authentication and authorization
- Input validation and sanitization
- Secure API endpoints with rate limiting

**Code Standards:**
- Typed and linted (TypeScript for type safety)
- Testable and includes unit/integration test hooks
- Framework-specific conventions (React Native best practices)
- Performance-optimized (for mobile apps)
- Clean folder structure and separation of concerns

**Mobile-Specific:**
- Responsive design for various screen sizes
- Offline-first capabilities where appropriate
- Native performance optimization
- Proper error handling and user feedback
- Accessibility compliance

---

## Mobile App Architecture

### Frontend (Mobile)
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **UI:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand
- **Navigation:** React Navigation v6
- **Testing:** Jest + React Native Testing Library

### Backend
- **Framework:** Supabase (Backend-as-a-Service)
- **Language:** TypeScript
- **Authentication:** Supabase Auth with Row Level Security (RLS)
- **API:** Supabase REST API + Edge Functions
- **Testing:** Jest + Supertest

### Database
- **Primary:** Supabase PostgreSQL
- **Security:** Row Level Security (RLS) policies
- **Real-time:** Supabase Realtime subscriptions
- **File Storage:** Supabase Storage
- **Backup:** Automated daily backups

### DevOps
- **CI/CD:** GitHub Actions
- **Testing:** Automated testing pipeline
- **Security:** SAST/DAST scanning
- **Monitoring:** Error tracking and performance monitoring

---

## Mobile App Structure

### Project Setup
```bash
# Create new Expo project with TypeScript
npx create-expo-app@latest sunrise-recovery-mobile --template expo-template-blank-typescript

# Install dependencies
npm install @supabase/supabase-js @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install nativewind tailwindcss react-native-screens react-native-safe-area-context
npm install zustand @tanstack/react-query react-hook-form zod
npm install expo-av expo-image-picker expo-secure-store
npm install @testing-library/react-native jest-expo
```

### Folder Structure
```
src/
├── app/                    # App entry point and navigation
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Dashboard screen
│       ├── videos.tsx     # Video library
│       ├── profile.tsx    # User profile
│       └── admin.tsx      # Admin panel (admin only)
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── VideoPlayer.tsx
│   ├── forms/            # Form components
│   │   ├── LoginForm.tsx
│   │   ├── ProfileForm.tsx
│   │   └── AdminPostForm.tsx
│   └── features/         # Feature-specific components
│       ├── auth/         # Authentication components
│       ├── videos/       # Video-related components
│       ├── dashboard/    # Dashboard components
│       └── admin/        # Admin components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Supabase client configuration
│   ├── auth.ts           # Authentication utilities
│   ├── api.ts            # API functions
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useVideos.ts      # Video data hook
│   ├── useUserProgress.ts # User progress hook
│   └── useAdminPosts.ts  # Admin posts hook
├── stores/               # State management (Zustand)
│   ├── authStore.ts      # Authentication state
│   ├── videoStore.ts     # Video state
│   └── userStore.ts      # User data state
├── types/                # TypeScript type definitions
│   ├── supabase.ts       # Database types
│   ├── api.ts            # API response types
│   └── navigation.ts     # Navigation types
├── constants/            # App constants
│   ├── colors.ts         # Color definitions
│   ├── config.ts         # App configuration
│   └── api.ts            # API endpoints
└── assets/              # Static assets
    ├── images/
    ├── icons/
    └── videos/
```

### Key Components

#### 1. Authentication Flow
```typescript
// src/components/features/auth/LoginScreen.tsx
// src/components/features/auth/SignupScreen.tsx
// src/components/features/auth/ForgotPasswordScreen.tsx
```

#### 2. Dashboard Components
```typescript
// src/components/features/dashboard/SobrietyCounter.tsx
// src/components/features/dashboard/DailyCheckIn.tsx
// src/components/features/dashboard/ProgressChart.tsx
// src/components/features/dashboard/AdminAnnouncements.tsx
```

#### 3. Video Library Components
```typescript
// src/components/features/videos/VideoList.tsx
// src/components/features/videos/VideoPlayer.tsx
// src/components/features/videos/VideoCategories.tsx
// src/components/features/videos/VideoFavorites.tsx
```

#### 4. Admin Components
```typescript
// src/components/features/admin/AdminDashboard.tsx
// src/components/features/admin/PostCreator.tsx
// src/components/features/admin/VideoUpload.tsx
// src/components/features/admin/UserManagement.tsx
```

### State Management (Zustand)
```typescript
// src/stores/authStore.ts
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, profile: UserProfile) => Promise<void>;
}

// src/stores/videoStore.ts
interface VideoState {
  videos: Video[];
  favorites: string[];
  watchHistory: WatchHistory[];
  isLoading: boolean;
  fetchVideos: () => Promise<void>;
  toggleFavorite: (videoId: string) => Promise<void>;
  recordWatch: (videoId: string, duration: number) => Promise<void>;
}
```

### API Layer
```typescript
// src/lib/api.ts
export const api = {
  // User management
  getUserProfile: (userId: string) => Promise<UserProfile>,
  updateUserProfile: (userId: string, data: Partial<UserProfile>) => Promise<void>,
  
  // Videos
  getVideos: (category?: string) => Promise<Video[]>,
  getVideo: (videoId: string) => Promise<Video>,
  recordVideoView: (videoId: string, userId: string) => Promise<void>,
  
  // Admin posts
  getAdminPosts: () => Promise<AdminPost[]>,
  createAdminPost: (post: CreateAdminPost) => Promise<void>,
  
  // User progress
  getUserProgress: (userId: string, date: string) => Promise<UserProgress>,
  updateUserProgress: (userId: string, data: Partial<UserProgress>) => Promise<void>,
};
```

### Navigation Structure
```typescript
// src/app/_layout.tsx
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// src/app/(tabs)/_layout.tsx
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="videos" options={{ title: 'Videos' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="admin" options={{ title: 'Admin' }} />
    </Tabs>
  );
}
```

### Testing Structure
```typescript
// __tests__/components/LoginForm.test.tsx
// __tests__/hooks/useAuth.test.ts
// __tests__/stores/authStore.test.ts
// __tests__/api/videos.test.ts
```

### Environment Configuration
```typescript
// app.config.ts
export default {
  expo: {
    name: 'Sunrise Recovery',
    slug: 'sunrise-recovery-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.sunriserecovery.app'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: 'com.sunriserecovery.app'
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
```

---

## Current Implementation Status

### ✅ Completed
- **Project Setup**: React Native with Expo and TypeScript
- **Dependencies**: All required packages installed
- **Configuration**: Tailwind CSS, Babel, Supabase client
- **Type Definitions**: Complete TypeScript types for database schema
- **State Management**: Zustand store for authentication
- **API Layer**: Complete API functions for all CRUD operations
- **UI Components**: Button, Input, Card components
- **Authentication**: Login and signup forms with validation
- **Basic App Structure**: Authentication flow implemented
- **Security**: Row Level Security (RLS) policies defined
- **Error Handling**: Proper error handling throughout
- **Code Quality**: TypeScript, ESLint, proper folder structure
- **Database Schema**: Complete SQL schema with indexes, triggers, and sample data
- **Setup Documentation**: Comprehensive database setup guide
- **Navigation Structure**: Complete Expo Router setup with tabs
- **Dashboard**: Sobriety counter, daily check-in with mood updates, admin announcements
- **Video Library**: Video browsing with categories and filtering
- **User Profile**: Profile management with editing capabilities
- **Admin Panel**: Admin-only interface for content management
- **Authentication Flow**: Login/signup screens with proper navigation
- **Full-Width Forms**: Clean, modern form design without containers
- **Routing**: Working authentication-based routing with Expo Router
- **Daily Check-in System**: Advanced mood tracking with multiple updates per day, timestamp tracking, and persistent state management
- **Admin Post Creation**: Modal-based post creation with comprehensive form validation, post types, priority levels, and publish/draft functionality
- **Admin Post Management**: Complete CRUD operations for admin posts including:
  - **Create Posts**: Full-screen form with validation and publish/draft options
  - **Edit Posts**: Pre-filled form for updating existing posts
  - **Delete Posts**: Confirmation dialog with permanent deletion
  - **View All Posts**: Recent posts section with status badges and action buttons
  - **Post Status Management**: Published/Draft status indicators
  - **Post Actions**: Edit and delete buttons for each post
  - **Auto-refresh**: Posts list updates after actions
  - **Separate Screen Navigation**: Create/edit posts as dedicated screens (not in tab navigation)

### 🔄 In Progress
- **Video Player**: Video playback functionality
- **Advanced Features**: Favorites system, watch history
- **Testing**: Unit and integration tests

### 📋 Next Steps
1. **Set up Supabase Database** ✅ **READY**
   - Complete database schema provided
   - Setup guide created
   - All SQL commands ready to run
   - Storage buckets and policies defined

2. **Complete Navigation Structure** ✅ **COMPLETED**
   - ✅ Implement tab navigation
   - ✅ Add authentication screens
   - ✅ Create protected routes
   - ✅ Dashboard with sobriety tracking
   - ✅ Video library with categories
   - ✅ User profile management
   - ✅ Admin content management

3. **Build Core Features** ✅ **COMPLETED**
   - ✅ Dashboard with sobriety tracking
   - ✅ Video library with categories
   - ✅ User profile management
   - ✅ Admin content management
   - ✅ Admin post management (Create, Read, Update, Delete)

4. **Add Advanced Features**
   - Video player implementation
   - Daily check-ins with mood tracking
   - Progress tracking and analytics
   - Favorites system
   - Watch history
   - Push notifications

5. **Testing & Deployment**
   - Unit tests for components
   - Integration tests for API
   - E2E testing
   - App store deployment

---

## Getting Started (Updated)

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/sunrise-recovery-app.git
cd sunrise-recovery-mobile
npm install
```

### 2. Configure Environment
```bash
# Create .env file with your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Set up Supabase Database
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from Settings > API
3. Go to SQL Editor in your Supabase dashboard
4. Copy and paste the entire contents of `database-schema.sql`
5. Run the SQL commands

### 4. Run the App
```bash
npx expo start --tunnel
# or
npx expo start --web
```

---

## Development Guidelines

### Code Standards
- ✅ **TypeScript**: All code is fully typed
- ✅ **ESLint**: Code linting configured
- ✅ **Prettier**: Code formatting
- ✅ **Component Structure**: Reusable, modular components
- ✅ **State Management**: Zustand for global state
- ✅ **API Layer**: Centralized API functions
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Security**: Input validation, secure authentication

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and state management testing
- **E2E Tests**: User flow testing
- **Performance**: Memory and performance monitoring

### Security Checklist
- ✅ **Authentication**: Supabase Auth with RLS
- ✅ **Input Validation**: Zod schemas for all forms
- ✅ **Error Handling**: Secure error messages
- ✅ **Data Protection**: HIPAA-compliant practices
- ✅ **API Security**: Rate limiting and validation
- ✅ **Row Level Security**: Complete RLS policies for all tables