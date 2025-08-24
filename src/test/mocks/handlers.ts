import { http, HttpResponse } from 'msw';

// Mock Supabase responses
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
};

const mockPartner = {
  id: 'test-partner-id',
  full_name: 'Test Partner',
  email: 'partner@example.com',
};

const mockCouple = {
  id: 'test-couple-id',
  user1_id: mockUser.id,
  user2_id: mockPartner.id,
  created_at: new Date().toISOString(),
};

const mockMemories = [
  {
    id: 'memory-1',
    couple_id: mockCouple.id,
    title: 'First Date',
    description: 'Our amazing first date',
    date: '2024-01-15',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'memory-2',
    couple_id: mockCouple.id,
    title: 'Vacation',
    description: 'Amazing vacation together',
    date: '2024-02-20',
    image_url: 'https://example.com/vacation.jpg',
    created_at: new Date().toISOString(),
  },
];

const mockActivities = [
  {
    id: 'activity-1',
    couple_id: mockCouple.id,
    title: 'Movie Night',
    category: 'date',
    description: 'Watching our favorite movie',
    date: '2024-03-15',
    completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'activity-2',
    couple_id: mockCouple.id,
    title: 'Cooking Together',
    category: 'creative',
    description: 'Making dinner together',
    date: '2024-03-20',
    completed: true,
    created_at: new Date().toISOString(),
  },
];

const mockDailyConnections = [
  {
    id: 'connection-1',
    couple_id: mockCouple.id,
    date: new Date().toISOString().split('T')[0],
    question: 'What made you smile today?',
    answers: {
      [mockUser.id]: 'Seeing your message this morning',
      [mockPartner.id]: 'The coffee you made for me',
    },
    created_at: new Date().toISOString(),
  },
];

export const handlers = [
  // Auth endpoints
  http.post('https://*.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    });
  }),

  http.get('https://*.supabase.co/auth/v1/user', () => {
    return HttpResponse.json(mockUser);
  }),

  // Database endpoints
  http.get('https://*.supabase.co/rest/v1/profiles', () => {
    return HttpResponse.json([mockUser, mockPartner]);
  }),

  http.get('https://*.supabase.co/rest/v1/couples', () => {
    return HttpResponse.json([mockCouple]);
  }),

  http.get('https://*.supabase.co/rest/v1/memories', () => {
    return HttpResponse.json(mockMemories);
  }),

  http.post('https://*.supabase.co/rest/v1/memories', async ({ request }) => {
    const body = await request.json();
    const newMemory = {
      id: `memory-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(newMemory);
  }),

  http.get('https://*.supabase.co/rest/v1/activities', () => {
    return HttpResponse.json(mockActivities);
  }),

  http.post('https://*.supabase.co/rest/v1/activities', async ({ request }) => {
    const body = await request.json();
    const newActivity = {
      id: `activity-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(newActivity);
  }),

  http.get('https://*.supabase.co/rest/v1/daily_connections', () => {
    return HttpResponse.json(mockDailyConnections);
  }),

  http.post('https://*.supabase.co/rest/v1/daily_connections', async ({ request }) => {
    const body = await request.json();
    const newConnection = {
      id: `connection-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    };
    return HttpResponse.json(newConnection);
  }),

  // Gemini AI endpoints
  http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'What is your favorite way to spend a quiet evening together?',
              },
            ],
          },
        },
      ],
    });
  }),

  // Storage endpoints
  http.post('https://*.supabase.co/storage/v1/object/upload', () => {
    return HttpResponse.json({
      path: 'mock-upload-path',
      id: 'mock-file-id',
    });
  }),

  // Real-time subscriptions (mock)
  http.get('https://*.supabase.co/realtime/v1/websocket', () => {
    return new HttpResponse(null, { status: 101 });
  }),
];



