// Temporary in-memory / local-mock admin data for demo purposes.
// No backend — keeps existing user/auth flows intact.

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Ava M.',
    email: 'ava@example.com',
    joinDate: '2026-03-14',
    moodStreak: 14,
    lastActiveAt: '2026-05-29T08:10:00Z',
    status: 'Active',
    suspended: false,
  },
  {
    id: 'u2',
    name: 'Jordan K.',
    email: 'jordan@example.com',
    joinDate: '2026-02-02',
    moodStreak: 7,
    lastActiveAt: '2026-05-29T07:02:00Z',
    status: 'Active',
    suspended: false,
  },
  {
    id: 'u3',
    name: 'Sam R.',
    email: 'sam@example.com',
    joinDate: '2026-01-18',
    moodStreak: 2,
    lastActiveAt: '2026-05-28T21:55:00Z',
    status: 'Suspended',
    suspended: true,
  },
  {
    id: 'u4',
    name: 'Noah P.',
    email: 'noah@example.com',
    joinDate: '2025-12-11',
    moodStreak: 22,
    lastActiveAt: '2026-05-29T01:30:00Z',
    status: 'Active',
    suspended: false,
  },
]

export const MOOD_LOGS = [
  { id: 'm1', userId: 'u1', mood: 'Happy', createdAt: '2026-05-28' },
  { id: 'm2', userId: 'u2', mood: 'Calm', createdAt: '2026-05-28' },
  { id: 'm3', userId: 'u1', mood: 'Neutral', createdAt: '2026-05-27' },
  { id: 'm4', userId: 'u3', mood: 'Sad', createdAt: '2026-05-27' },
  { id: 'm5', userId: 'u4', mood: 'Stressed', createdAt: '2026-05-27' },
  { id: 'm6', userId: 'u2', mood: 'Happy', createdAt: '2026-05-26' },
]

export const JOURNAL_ENTRIES = [
  {
    id: 'j1',
    userId: 'u1',
    title: 'Breath is a compass',
    moodTag: 'Calm',
    createdAt: '2026-05-28',
    contentPreview:
      'Today I noticed how my shoulders softened when I slowed my breathing. I feel more grounded.',
    flagged: false,
  },
  {
    id: 'j2',
    userId: 'u2',
    title: 'Small wins',
    moodTag: 'Happy',
    createdAt: '2026-05-27',
    contentPreview:
      'I finished a task I kept postponing. The relief was immediate. I want to keep honoring my pace.',
    flagged: true,
  },
  {
    id: 'j3',
    userId: 'u3',
    title: 'The weight lifted',
    moodTag: 'Sad',
    createdAt: '2026-05-26',
    contentPreview:
      'A hard conversation happened, but afterward I felt lighter. I’m learning to be patient with myself.',
    flagged: false,
  },
]

export const FOCUS_SESSIONS = [
  { id: 'f1', userId: 'u1', durationHours: 1.5, createdAt: '2026-05-28' },
  { id: 'f2', userId: 'u2', durationHours: 2.25, createdAt: '2026-05-28' },
  { id: 'f3', userId: 'u4', durationHours: 3.0, createdAt: '2026-05-27' },
  { id: 'f4', userId: 'u1', durationHours: 0.75, createdAt: '2026-05-27' },
  { id: 'f5', userId: 'u2', durationHours: 1.1, createdAt: '2026-05-26' },
]

export const WEEKLY_PRODUCTIVITY_POINTS = [
  { day: 'Mon', hours: 1.2 },
  { day: 'Tue', hours: 2.1 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 2.7 },
  { day: 'Fri', hours: 3.2 },
  { day: 'Sat', hours: 2.4 },
  { day: 'Sun', hours: 1.6 },
]

export const ADMIN_SETTINGS_DEFAULTS = {
  appName: 'ScribeSpace',
  themeAccent: 'Lavender/Blue',
  aiFeatureEnabled: true,
  registrationEnabled: true,
  maintenanceMode: false,
}

