---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### 4.1.1 Response Time
- **NFR-001:** Page load time must be under 3 seconds on 3G connection
- **NFR-002:** API response time must be under 500ms for 95% of requests
- **NFR-003:** Image upload must complete within 10 seconds for files under 5MB
- **NFR-004:** Real-time notifications must appear within 2 seconds

#### 4.1.2 Scalability
- **NFR-005:** System must support up to 10,000 concurrent users
- **NFR-006:** Database must handle up to 1 million user records
- **NFR-007:** File storage must support up to 100GB of user content
- **NFR-008:** System must maintain performance under 80% CPU usage

### 4.2 Reliability Requirements

#### 4.2.1 Availability
- **NFR-009:** System must have 99.9% uptime (maximum 8.76 hours downtime per year)
- **NFR-010:** System must gracefully handle database connection failures
- **NFR-011:** System must provide offline functionality for core features
- **NFR-012:** System must automatically recover from temporary failures

#### 4.2.2 Data Integrity
- **NFR-013:** All user data must be backed up daily
- **NFR-014:** Data loss must not exceed 1 hour of activity
- **NFR-015:** System must validate all data inputs before storage
- **NFR-016:** System must prevent data corruption during concurrent access

### 4.3 Security Requirements

#### 4.3.1 Authentication Security
- **NFR-017:** Passwords must be hashed using bcrypt with salt
- **NFR-018:** JWT tokens must expire after 24 hours
- **NFR-019:** Failed login attempts must be rate-limited
- **NFR-020:** Session tokens must be invalidated on logout

#### 4.3.2 Data Security
- **NFR-021:** All data transmission must use HTTPS/TLS 1.3
- **NFR-022:** User data must be encrypted at rest
- **NFR-023:** API endpoints must be protected against CSRF attacks
- **NFR-024:** File uploads must be scanned for malware

### 4.4 Usability Requirements

#### 4.4.1 Accessibility
- **NFR-025:** Application must meet WCAG 2.1 AA standards
- **NFR-026:** All interactive elements must be keyboard accessible
- **NFR-027:** Color contrast must meet accessibility guidelines
- **NFR-028:** Screen readers must be able to navigate all content

#### 4.4.2 User Experience
- **NFR-029:** Application must be intuitive for users with basic technical skills
- **NFR-030:** Error messages must be clear and actionable
- **NFR-031:** Loading states must provide user feedback
- **NFR-032:** Application must work on mobile and desktop devices

### 4.5 Compatibility Requirements

#### 4.5.1 Browser Support
- **NFR-033:** Application must work on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **NFR-034:** Application must be responsive on screen sizes 320px to 1920px
- **NFR-035:** Application must support touch and mouse interactions

#### 4.5.2 Device Support
- **NFR-036:** Application must work on iOS 14+ and Android 8+
- **NFR-037:** Application must support offline functionality
- **NFR-038:** Application must be installable as a PWA

---

## 5. User Interface Requirements

### 5.1 Design System

#### 5.1.1 Color Palette
- **Primary Color:** Soft Rose (#F28B82)
- **Secondary Color:** Calm Lavender (#A5B4FC)
- **Accent Color:** Sunset Coral (#FFB085)
- **Background:** Soft Off-White (#FAFAFA)
- **Text Primary:** Charcoal Gray (#333333)
- **Text Secondary:** Cool Gray (#9CA3AF)

#### 5.1.2 Typography
- **Display Font:** Clash Display (headings)
- **Body Font:** Inter (body text)
- **Font Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px, 36px
- **Line Heights:** 1.3 (tight), 1.5 (normal)

#### 5.1.3 Spacing System
- **Base Unit:** 4px
- **Spacing Scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### 5.2 Layout Requirements

#### 5.2.1 Dashboard Layout
- **Header:** Navigation bar with user profile and notifications
- **Sidebar:** Quick access to main features (mobile: bottom navigation)
- **Main Content:** Feature-specific content area
- **Footer:** Links to help, privacy, and terms

#### 5.2.2 Responsive Design
- **Mobile First:** Design must prioritize mobile experience
- **Breakpoints:** 360px, 600px, 768px, 1024px, 1280px, 1440px, 1920px
- **Navigation:** Bottom navigation on mobile, sidebar on desktop

### 5.3 Component Requirements

#### 5.3.1 Interactive Elements
- **Buttons:** Primary, secondary, ghost, and accent variants
- **Inputs:** Text, email, password, date, and file upload fields
- **Cards:** Memory cards, activity cards, and feature cards
- **Modals:** Confirmation dialogs and form modals

#### 5.3.2 Feedback Elements
- **Loading States:** Skeleton screens and spinners
- **Error States:** Clear error messages and recovery options
- **Success States:** Confirmation messages and visual feedback
- **Empty States:** Helpful guidance when no content exists

---

## 6. Technical Architecture

### 6.1 Frontend Architecture

#### 6.1.1 Technology Stack
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite for fast development and building
- **Routing:** React Router DOM for client-side routing
- **State Management:** React Context API and custom hooks
- **Styling:** Tailwind CSS with custom design tokens
- **Animations:** Framer Motion for smooth transitions

#### 6.1.2 Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── modals/       # Modal components
│   └── onboarding/   # Onboarding components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── pages/           # Page components
└── test/            # Test files
```

### 6.2 Backend Architecture

#### 6.2.1 Supabase Integration
- **Database:** PostgreSQL with real-time subscriptions
- **Authentication:** Supabase Auth with JWT tokens
- **Storage:** Supabase Storage for file uploads
- **Real-time:** WebSocket connections for live updates
- **Edge Functions:** Serverless functions for complex operations

#### 6.2.2 AI Integration
- **Provider:** Google Gemini AI
- **Features:** Daily question generation, conversation analysis
- **API Key:** Environment variable configuration
- **Rate Limiting:** Request throttling to prevent abuse

### 6.3 Data Flow

#### 6.3.1 Authentication Flow
1. User registers/logs in via Supabase Auth
2. JWT token is stored in secure storage
3. Token is included in all API requests
4. Token is refreshed automatically before expiration

#### 6.3.2 Data Synchronization
1. Real-time subscriptions listen for database changes
2. Local state is updated when changes occur
3. Optimistic updates provide immediate feedback
4. Conflict resolution handles concurrent modifications

---

## 7. Database Schema

### 7.1 Core Tables

#### 7.1.1 Users Table (Supabase Auth)
```sql
-- Managed by Supabase Auth
users (
  id: uuid PRIMARY KEY,
  email: text UNIQUE NOT NULL,
  created_at: timestamp,
  updated_at: timestamp
)
```

#### 7.1.2 Profiles Table
```sql
profiles (
  id: uuid PRIMARY KEY REFERENCES users(id),
  full_name: text,
  avatar_url: text,
  bio: text,
  updated_at: timestamp
)
```

#### 7.1.3 Couples Table
```sql
couples (
  id: uuid PRIMARY KEY,
  user1_id: uuid REFERENCES users(id),
  user2_id: uuid REFERENCES users(id),
  created_at: timestamp
)
```

#### 7.1.4 Daily Connections Table
```sql
daily_connections (
  id: uuid PRIMARY KEY,
  couple_id: uuid REFERENCES couples(id),
  date: date NOT NULL,
  question: text NOT NULL,
  answers: jsonb,
  created_at: timestamp
)
```

#### 7.1.5 Memories Table
```sql
memories (
  id: uuid PRIMARY KEY,
  couple_id: uuid REFERENCES couples(id),
  user_id: uuid REFERENCES users(id),
  title: text NOT NULL,
  description: text,
  date: date NOT NULL,
  image_url: text,
  created_at: timestamp
)
```

#### 7.1.6 Activities Table
```sql
activities (
  id: uuid PRIMARY KEY,
  couple_id: uuid REFERENCES couples(id),
  user_id: uuid REFERENCES users(id),
  title: text NOT NULL,
  description: text,
  date: date,
  location: text,
  category: text,
  completed: boolean DEFAULT false,
  created_at: timestamp
)
```

#### 7.1.7 Discoveries Table
```sql
discoveries (
  id: uuid PRIMARY KEY,
  couple_id: uuid REFERENCES couples(id),
  sender_id: uuid REFERENCES users(id),
  category: discovery_category,
  title: text,
  name: text,
  author: text,
  artist: text,
  director: text,
  year: integer,
  url: text,
  note: text,
  created_at: timestamp
)
```

### 7.2 Enums and Types

#### 7.2.1 Discovery Categories
```sql
CREATE TYPE discovery_category AS ENUM (
  'Music', 'Movie', 'Book', 'Place', 'Link'
);
```

#### 7.2.2 Quest Types
```sql
CREATE TYPE quest_type AS ENUM (
  'challenge', 'routine'
);

CREATE TYPE quest_status AS ENUM (
  'in-progress', 'available', 'completed'
);

CREATE TYPE quest_frequency AS ENUM (
  'daily', 'weekly'
);
```

---

## 8. Security Requirements

### 8.1 Authentication Security

#### 8.1.1 Password Requirements
- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Must contain at least one special character
- Cannot be common passwords

#### 8.1.2 Session Management
- JWT tokens expire after 24 hours
- Refresh tokens expire after 7 days
- Sessions are invalidated on password change
- Multiple device sessions are supported

### 8.2 Data Protection

#### 8.2.1 Data Encryption
- All data transmitted over HTTPS/TLS 1.3
- Sensitive data encrypted at rest
- File uploads encrypted in storage
- Database backups encrypted

#### 8.2.2 Privacy Protection
- User data not shared with third parties
- Data retention policies implemented
- User consent required for data processing
- Right to data deletion provided

### 8.3 API Security

#### 8.3.1 Endpoint Protection
- All endpoints require authentication
- Rate limiting on all API calls
- Input validation on all parameters
- SQL injection prevention

#### 8.3.2 File Upload Security
- File type validation
- File size limits (5MB per file)
- Malware scanning
- Secure file storage

