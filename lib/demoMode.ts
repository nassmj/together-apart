// Demo mode for testing the app without API keys
export const DEMO_MODE = import.meta.env.DEV && !import.meta.env.VITE_SUPABASE_URL;

export const demoUser = {
  id: 'demo-user-id',
  email: 'demo@together-apart.com',
  full_name: 'Demo User',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
};

export const demoPartner = {
  id: 'demo-partner-id',
  full_name: 'Demo Partner',
  email: 'partner@together-apart.com',
  avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
};

export const demoCouple = {
  id: 'demo-couple-id',
  user1_id: demoUser.id,
  user2_id: demoPartner.id,
  created_at: new Date().toISOString(),
};

export const demoMemories = [
  {
    id: 'memory-1',
    couple_id: demoCouple.id,
    title: 'Our First Date',
    description: 'We had an amazing first date at that little Italian restaurant downtown. The food was incredible and the conversation was even better!',
    date: '2024-01-15',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'memory-2',
    couple_id: demoCouple.id,
    title: 'Beach Vacation',
    description: 'Our first vacation together was absolutely perfect. We spent a week at the beach, building sandcastles and watching the sunset.',
    date: '2024-02-20',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    created_at: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'memory-3',
    couple_id: demoCouple.id,
    title: 'Cooking Together',
    description: 'We tried making homemade pasta for the first time. It was a mess but so much fun! The kitchen was covered in flour.',
    date: '2024-03-10',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    created_at: new Date('2024-03-10').toISOString(),
  },
];

export const demoActivities = [
  {
    id: 'activity-1',
    couple_id: demoCouple.id,
    title: 'Movie Night',
    category: 'date',
    description: 'Watching our favorite movie with popcorn and blankets',
    date: '2024-03-25',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'activity-2',
    couple_id: demoCouple.id,
    title: 'Hiking Adventure',
    category: 'adventure',
    description: 'Exploring the new hiking trail we discovered',
    date: '2024-03-30',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'activity-3',
    couple_id: demoCouple.id,
    title: 'Cooking Class',
    category: 'creative',
    description: 'Learning to make sushi together',
    date: '2024-04-05',
    completed: false,
    created_at: new Date().toISOString(),
  },
];

export const demoDailyConnections = [
  {
    id: 'connection-1',
    couple_id: demoCouple.id,
    date: new Date().toISOString().split('T')[0],
    question: 'What made you smile today?',
    answers: {
      [demoUser.id]: 'Seeing your message this morning made my day!',
      [demoPartner.id]: 'The coffee you made for me was perfect.',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'connection-2',
    couple_id: demoCouple.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    question: 'What is your favorite way to spend a quiet evening together?',
    answers: {
      [demoUser.id]: 'I love when we just sit on the couch and talk about our day.',
      [demoPartner.id]: 'Reading books together while cuddling is my favorite.',
    },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoDiscoveries = [
  {
    id: 'discovery-1',
    couple_id: demoCouple.id,
    type: 'music',
    title: 'The Weeknd - Blinding Lights',
    description: 'This song reminds me of our late-night drives together',
    url: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
    shared_by: demoUser.id,
    created_at: new Date().toISOString(),
  },
  {
    id: 'discovery-2',
    couple_id: demoCouple.id,
    type: 'movie',
    title: 'The Notebook',
    description: 'A classic love story that always makes us cry',
    url: 'https://www.imdb.com/title/tt0332280/',
    shared_by: demoPartner.id,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo mode utilities
export const isDemoMode = () => DEMO_MODE;

export const getDemoData = (type: 'user' | 'partner' | 'couple' | 'memories' | 'activities' | 'connections' | 'discoveries') => {
  switch (type) {
    case 'user':
      return demoUser;
    case 'partner':
      return demoPartner;
    case 'couple':
      return demoCouple;
    case 'memories':
      return demoMemories;
    case 'activities':
      return demoActivities;
    case 'connections':
      return demoDailyConnections;
    case 'discoveries':
      return demoDiscoveries;
    default:
      return null;
  }
};
