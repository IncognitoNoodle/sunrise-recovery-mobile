import { Video } from '../types/supabase';

// Sample video data with real recovery story videos
export const sampleVideos: Omit<Video, 'created_at' | 'updated_at'>[] = [
  // Coping Skills
  {
    id: "coping-1",
    title: "Kara's Story - Addiction Recovery Journey",
    description: "Kara shares her powerful story of overcoming addiction and finding strength in recovery.",
    category: 'coping',
    duration: 420, // ~7 min
    thumbnail_url: "https://img.youtube.com/vi/avwelLFOUKk/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=avwelLFOUKk",
    is_published: true,
    created_by: "admin",
    view_count: 150000,
    tags: ['recovery story', 'addiction', 'coping', 'inspiration'],
    featured: true,
  },
  {
    id: "coping-2",
    title: "How Alcohol Took Over My Life: Addiction and Recovery",
    description: "A raw and honest account of how addiction takes control and the path to recovery.",
    category: 'coping',
    duration: 480, // ~8 min
    thumbnail_url: "https://img.youtube.com/vi/wk8cvg3TwOw/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=wk8cvg3TwOw",
    is_published: true,
    created_by: "admin",
    view_count: 200000,
    tags: ['alcohol addiction', 'recovery story', 'coping', 'honesty'],
    featured: false,
  },
  {
    id: "coping-3",
    title: "Anthony's Alcohol Addiction Recovery Story",
    description: "Anthony's journey from rock bottom to finding hope and purpose in recovery.",
    category: 'coping',
    duration: 360, // ~6 min
    thumbnail_url: "https://img.youtube.com/vi/FAFHFia4oEg/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=FAFHFia4oEg",
    is_published: true,
    created_by: "admin",
    view_count: 180000,
    tags: ['alcohol recovery', 'personal story', 'hope', 'coping'],
    featured: false,
  },

  // Coach Tips
  {
    id: "coach-1",
    title: "Danay's Story - Recovery Journey",
    description: "Danay's inspiring story of overcoming addiction and finding purpose in recovery.",
    category: 'coach-tips',
    duration: 330, // ~5-6 min
    thumbnail_url: "https://img.youtube.com/vi/mKd0BlxEdTw/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=mKd0BlxEdTw",
    is_published: true,
    created_by: "admin",
    view_count: 300000,
    tags: ['recovery story', 'addiction', 'education', 'inspiration'],
    featured: true,
  },
  {
    id: "coach-2",
    title: "Calvin's Story of Addiction and Recovery",
    description: "Calvin shares his journey from addiction to recovery and the lessons learned along the way.",
    category: 'coach-tips',
    duration: 360, // ~6 min
    thumbnail_url: "https://img.youtube.com/vi/K6rzrgP3Omk/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=K6rzrgP3Omk",
    is_published: true,
    created_by: "admin",
    view_count: 250000,
    tags: ['addiction recovery', 'personal story', 'education', 'hope'],
    featured: true,
  },
  {
    id: "coach-3",
    title: "2 POWERFUL Stories of Addiction, Recovery & Love That Lasts",
    description: "Two incredible stories of couples who found love and strength in recovery together.",
    category: 'coach-tips',
    duration: 540, // ~9 min
    thumbnail_url: "https://img.youtube.com/vi/pxcgcuCkpNg/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=pxcgcuCkpNg",
    is_published: true,
    created_by: "admin",
    view_count: 400000,
    tags: ['couples recovery', 'love', 'addiction', 'education'],
    featured: false,
  },

  // Mindfulness
  {
    id: "mindfulness-1",
    title: "Real Stories of Addiction (Shorts Series)",
    description: "A collection of powerful short stories from people who have overcome addiction.",
    category: 'mindfulness',
    duration: 300, // ~5 min each
    thumbnail_url: "https://img.youtube.com/vi/aro-odOdhK8/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=aro-odOdhK8",
    is_published: true,
    created_by: "admin",
    view_count: 500000,
    tags: ['recovery stories', 'addiction', 'education', 'inspiration'],
    featured: true,
  },
  {
    id: "mindfulness-2",
    title: "The Most Courageous Addiction Recovery Story You've Ever Heard",
    description: "An incredibly brave story of overcoming addiction and finding strength in recovery.",
    category: 'mindfulness',
    duration: 360, // ~6 min
    thumbnail_url: "https://img.youtube.com/vi/J9jq9h1YM_4/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=J9jq9h1YM_4",
    is_published: true,
    created_by: "admin",
    view_count: 350000,
    tags: ['courage', 'recovery story', 'inspiration', 'strength'],
    featured: false,
  },
  {
    id: "mindfulness-3",
    title: "Addiction: Tomorrow Is Going To Be Better (Brandon Novak)",
    description: "Brandon Novak's powerful message of hope and recovery that has inspired millions.",
    category: 'mindfulness',
    duration: 420, // ~7 min
    thumbnail_url: "https://img.youtube.com/vi/OG--M8B04DA/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=OG--M8B04DA",
    is_published: true,
    created_by: "admin",
    view_count: 2000000,
    tags: ['brandon novak', 'hope', 'recovery', 'inspiration'],
    featured: false,
  },

  // Motivation
  {
    id: "motivation-1",
    title: "THE JOURNEY… – Taylor's Story",
    description: "Taylor's inspiring journey from addiction to recovery and finding purpose in life.",
    category: 'motivation',
    duration: 300, // ~5 min
    thumbnail_url: "https://img.youtube.com/vi/f9tV6TCmv3w/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=f9tV6TCmv3w",
    is_published: true,
    created_by: "admin",
    view_count: 400000,
    tags: ['taylor story', 'recovery journey', 'motivation', 'inspiration'],
    featured: true,
  },
  {
    id: "motivation-2",
    title: "Anthony's Alcohol Addiction Recovery Story",
    description: "Anthony's powerful story of overcoming alcohol addiction and finding hope in recovery.",
    category: 'motivation',
    duration: 360, // ~6 min
    thumbnail_url: "https://img.youtube.com/vi/FAFHFia4oEg/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=FAFHFia4oEg",
    is_published: true,
    created_by: "admin",
    view_count: 180000,
    tags: ['alcohol recovery', 'personal story', 'motivation', 'hope'],
    featured: true,
  },
  {
    id: "motivation-3",
    title: "Addiction: Tomorrow Is Going To Be Better (Brandon Novak)",
    description: "Brandon Novak's powerful message of hope and recovery that has inspired millions.",
    category: 'motivation',
    duration: 420, // ~7 min
    thumbnail_url: "https://img.youtube.com/vi/OG--M8B04DA/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=OG--M8B04DA",
    is_published: true,
    created_by: "admin",
    view_count: 2000000,
    tags: ['brandon novak', 'hope', 'recovery', 'motivation'],
    featured: false,
  },

  // Education
  {
    id: "education-1",
    title: "Danay's Story - Recovery Journey",
    description: "Danay's inspiring story of overcoming addiction and finding purpose in recovery.",
    category: 'education',
    duration: 330, // ~5-6 min
    thumbnail_url: "https://img.youtube.com/vi/mKd0BlxEdTw/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=mKd0BlxEdTw",
    is_published: true,
    created_by: "admin",
    view_count: 300000,
    tags: ['recovery story', 'addiction', 'education', 'inspiration'],
    featured: true,
  },
  {
    id: "education-2",
    title: "Calvin's Story of Addiction and Recovery",
    description: "Calvin shares his journey from addiction to recovery and the lessons learned along the way.",
    category: 'education',
    duration: 360, // ~6 min
    thumbnail_url: "https://img.youtube.com/vi/K6rzrgP3Omk/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=K6rzrgP3Omk",
    is_published: true,
    created_by: "admin",
    view_count: 250000,
    tags: ['addiction recovery', 'personal story', 'education', 'hope'],
    featured: false,
  },
  {
    id: "education-3",
    title: "Real Stories of Addiction (Shorts Series)",
    description: "A collection of powerful short stories from people who have overcome addiction.",
    category: 'education',
    duration: 300, // ~5 min each
    thumbnail_url: "https://img.youtube.com/vi/aro-odOdhK8/maxresdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=aro-odOdhK8",
    is_published: true,
    created_by: "admin",
    view_count: 500000,
    tags: ['recovery stories', 'addiction', 'education', 'inspiration'],
    featured: false,
  },
];

// Helper function to get videos by category
export const getVideosByCategory = (category?: string) => {
  if (!category || category === 'all') {
    return sampleVideos;
  }
  return sampleVideos.filter(video => video.category === category);
};

// Helper function to get featured videos
export const getFeaturedVideos = () => {
  return sampleVideos.filter(video => video.featured);
}; 