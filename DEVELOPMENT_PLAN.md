# Habit Tracking App - Development Plan

## Overview
A Progressive Web App (PWA) for tracking daily habits with morning/evening categorization, calendar views, push notifications, and detailed analytics including time tracking and skip counts. **Multi-user support with authentication** for production deployment.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **CSS Framework**: Tailwind CSS (mobile-first, customizable, great for PWAs)
- **UI Components**: Headless UI or Radix UI (accessible, unstyled components)
- **State Management**: Zustand or React Context (lightweight for habit data)
- **Date Handling**: date-fns or Day.js
- **PWA**: Workbox for service worker management
- **Push Notifications**: Web Push API with service worker
- **Authentication**: JWT token storage in httpOnly cookies or localStorage

### Backend
- **Runtime**: Node.js with Express or Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL (recommended for multi-user production)
  - **Alternative options**: 
    - MySQL (good alternative, Prisma supports it)
    - MongoDB (if you prefer NoSQL, but relational data fits better here)
    - SQLite (only for local dev/testing, not recommended for production)
- **ORM**: Prisma (type-safe, excellent TypeScript support, easy migrations)
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Push Notifications**: web-push library for VAPID keys management
- **Production**: Docker containerization, environment-based configuration-*
- **Deployment**: Render, Railway, Heroku, or VPS (DigitalOcean, AWS, etc.)

### Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // hashed with bcrypt
  name          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  habits        Habit[]
  subscriptions NotificationSubscription[]
  
  @@index([email])
}

model Habit {
  id            String   @id @default(cuid())
  userId        String
  name          String
  description   String?
  category      String   // "morning", "evening", "other"
  frequency     String   // "daily", "weekly"
  timesPerWeek  Int?     // if weekly, how many times
  timesPerDay   Int?     // if daily, how many times
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  completions   HabitCompletion[]
  skips         HabitSkip[]
  subscriptions NotificationSubscription[]
  
  @@index([userId])
  @@index([userId, category])
}

model HabitCompletion {
  id          String   @id @default(cuid())
  habitId     String
  date        DateTime @db.Date
  duration    Int?     // duration in minutes
  notes       String?
  completedAt DateTime @default(now())
  
  habit       Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@unique([habitId, date])
  @@index([habitId, date])
  @@index([habitId])
}

model HabitSkip {
  id          String   @id @default(cuid())
  habitId     String
  date        DateTime @db.Date
  reason      String?
  skippedAt   DateTime @default(now())
  
  habit       Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@unique([habitId, date])
  @@index([habitId, date])
  @@index([habitId])
}

model NotificationSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  keys      Json     // p256dh and auth keys
  habitId   String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  habit     Habit?   @relation(fields: [habitId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([habitId])
}
```

## Project Structure

```
habits-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── habits/
│   │   │   │   ├── HabitList.tsx
│   │   │   │   ├── HabitForm.tsx
│   │   │   │   ├── HabitCard.tsx
│   │   │   │   └── HabitCategoryFilter.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── CalendarView.tsx
│   │   │   │   └── HabitCalendar.tsx
│   │   │   ├── statistics/
│   │   │   │   ├── StatisticsPanel.tsx
│   │   │   │   └── StatisticsChart.tsx
│   │   │   └── notifications/
│   │   │       └── NotificationSettings.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useHabits.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useCalendar.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── habitStore.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── pushNotifications.ts
│   │   ├── utils/
│   │   │   ├── dateUtils.ts
│   │   │   ├── calculations.ts
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js (service worker)
│   │   └── icons/ (PWA icons)
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── habits.ts
│   │   │   ├── completions.ts
│   │   │   ├── skips.ts
│   │   │   ├── statistics.ts
│   │   │   └── notifications.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── habitController.ts
│   │   │   ├── completionController.ts
│   │   │   ├── skipController.ts
│   │   │   ├── statisticsController.ts
│   │   │   └── notificationController.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── pushNotificationService.ts
│   │   │   └── analyticsService.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── bcrypt.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
├── shared/
│   └── types/
│       └── index.ts (shared TypeScript types)
├── package.json (root workspace)
├── .env.example
└── README.md
```

## Implementation Phases

### Phase 1: Project Setup and Authentication
1. Initialize monorepo structure (npm workspaces or pnpm)
2. Set up frontend with Vite + React + TypeScript
3. Set up backend with Express/Fastify + TypeScript
4. Configure Prisma with PostgreSQL database
5. Set up Tailwind CSS in frontend
6. Create User model in database schema
7. Implement authentication (register, login, logout)
8. Create JWT middleware for protected routes
9. Build authentication UI (login/register forms)
10. Create protected route wrapper component
11. Set up authentication state management

### Phase 2: Core Habit Management
1. Implement Prisma schema with User-Habit relationship
2. Run database migrations
3. Create API endpoints for CRUD operations (habits) with user isolation
4. Add authentication middleware to habit routes
5. Build habit store (Zustand/Context) with user context
6. Create HabitList component with category filtering
7. Create HabitForm component (add/edit)
8. Implement habit deletion with confirmation
9. Add user-specific data fetching (only show current user's habits)
10. Add basic error handling and validation

### Phase 3: Habit Completion Tracking
1. Create completion API endpoints with user authentication
2. Implement completion tracking UI
3. Add duration input for habits (time tracking)
4. Create skip functionality with reason input
5. Build completion status indicators (done/skipped/pending)
6. Add daily/weekly frequency validation
7. Ensure user can only track their own habits

### Phase 4: Calendar Views
1. Install and configure calendar library (react-calendar or custom)
2. Create HabitCalendar component showing completion status
3. Implement calendar view per habit
4. Add month navigation
5. Color-code dates (completed, skipped, pending)
6. Add click-to-complete/skip from calendar
7. Ensure calendar data is user-specific

### Phase 5: Statistics and Analytics
1. Create analytics service to calculate:
   - Total time spent on habit
   - Total completions count
   - Total skips count
   - Completion rate (percentage)
   - Streak tracking (consecutive days)
   - Weekly/monthly summaries
2. Build StatisticsPanel component
3. Display stats per habit and overall (user-specific)
4. Add charts/graphs (using recharts or chart.js)
5. Add user-specific statistics endpoints

### Phase 6: PWA Setup
1. Create manifest.json with app metadata
2. Generate PWA icons (multiple sizes)
3. Set up service worker with Workbox
4. Implement offline support (cache API responses)
5. Add install prompt functionality
6. Test PWA installation on mobile devices
7. Handle authentication in service worker

### Phase 7: Push Notifications
1. Generate VAPID keys for web push
2. Implement notification subscription API with user association
3. Create notification permission request UI
4. Set up service worker notification handlers
5. Create notification scheduling service
6. Implement per-habit notification settings (user-specific)
7. Add notification reminder logic (morning/evening times)
8. Create notification settings UI
9. Test notifications on various devices
10. Ensure notifications are user-specific

### Phase 8: UI/UX Polish
1. Implement responsive mobile-first design
2. Add loading states and skeletons
3. Add animations and transitions
4. Improve accessibility (ARIA labels, keyboard navigation)
5. Add dark mode support
6. Optimize performance (code splitting, lazy loading)
7. Add error boundaries
8. Implement optimistic UI updates
9. Add user profile/settings page

### Phase 9: Production Deployment Setup
1. Set up environment variables for production
2. Create Docker configuration (Dockerfile, docker-compose.yml)
3. Set up PostgreSQL database in production (Render, Railway, or managed service)
4. Configure CORS for production domain
5. Set up SSL/HTTPS (required for PWA and push notifications)
6. Configure environment-based API URLs
7. Set up database connection pooling
8. Add production logging and monitoring
9. Create deployment scripts
10. Test production deployment locally with Docker

### Phase 10: Testing and Optimization
1. Write unit tests for utilities and services
2. Write integration tests for API endpoints
3. Write authentication flow tests
4. Test on multiple devices and browsers
5. Optimize bundle size
6. Add performance monitoring
7. Fix any bugs or edge cases
8. Load testing for multi-user scenarios
9. Security audit (password hashing, JWT security, SQL injection prevention)

## Key Features Implementation Details

### Authentication
- **Registration**: Email, password, name (optional)
- **Login**: Email and password
- **JWT Tokens**: Stored in httpOnly cookies (more secure) or localStorage
- **Password Hashing**: bcrypt with salt rounds (10-12)
- **Protected Routes**: All habit-related endpoints require authentication
- **User Isolation**: Users can only access their own habits and data

### Habit Configuration
- **Frequency**: Dropdown (Daily/Weekly)
- **Times per day/week**: Number input (1-7 for weekly, 1+ for daily)
- **Category**: Radio buttons or dropdown (Morning/Evening/Other)
- **Duration**: Optional number input (minutes)
- **User Association**: Each habit is tied to a user

### Calendar View
- Each habit has its own calendar
- Dates colored: green (completed), red (skipped), gray (pending), blue (today)
- Click date to mark complete/skip
- Show streaks visually
- Month navigation
- User-specific data only

### Statistics Tracking
- **Total time**: Sum of all completion durations (user-specific)
- **Completion count**: Total number of completions (user-specific)
- **Skip count**: Total number of skips (user-specific)
- **Completion rate**: (Completions / (Completions + Skips)) * 100
- **Current streak**: Consecutive days with completion
- **Longest streak**: Highest consecutive days achieved
- All statistics are user-specific

### Push Notifications
- Request permission on first visit (per user)
- Per-habit notification settings (user-specific)
- Configurable reminder times (morning habits: 7-9 AM, evening habits: 7-9 PM)
- Notification payload includes habit name and motivation message
- Click notification opens app and focuses on habit
- User-specific notifications only

## Database Recommendations

**PostgreSQL** (Recommended):
- Robust for production multi-user applications
- Excellent performance at scale
- ACID compliance for data integrity
- Great with Prisma ORM
- Free tier options: Render, Railway, Supabase, Neon
- Self-hosted option: Docker container

**Alternatives** (if needed):
- **MySQL**: Good alternative, Prisma supports it, similar to PostgreSQL
- **MongoDB**: If you prefer NoSQL, but relational data structure fits better here
- **SQLite**: Only for local development/testing, NOT for production multi-user apps

## CSS Library Recommendation

**Tailwind CSS** (Recommended):
- Mobile-first approach
- Excellent for PWA development
- Highly customizable
- Small bundle size with purging
- Great developer experience
- Easy to create responsive designs
- Works well with Headless UI components

Alternative: **Styled Components** or **Emotion** if you prefer CSS-in-JS

## API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
```

### Habits (All require authentication)
```
GET    /api/habits              - Get all habits for current user
POST   /api/habits              - Create habit for current user
GET    /api/habits/:id          - Get habit by ID (user's own habit)
PUT    /api/habits/:id          - Update habit (user's own habit)
DELETE /api/habits/:id          - Delete habit (user's own habit)
```

### Completions (All require authentication)
```
GET    /api/habits/:id/completions  - Get completions for habit (user's own)
POST   /api/habits/:id/completions  - Mark habit complete (user's own)
DELETE /api/completions/:id         - Remove completion (user's own)
```

### Skips (All require authentication)
```
GET    /api/habits/:id/skips        - Get skips for habit (user's own)
POST   /api/habits/:id/skips        - Mark habit skipped (user's own)
DELETE /api/skips/:id               - Remove skip (user's own)
```

### Statistics (All require authentication)
```
GET    /api/habits/:id/statistics   - Get habit statistics (user's own)
GET    /api/statistics              - Get overall statistics (current user)
```

### Notifications (All require authentication)
```
POST   /api/notifications/subscribe - Subscribe to push notifications
DELETE /api/notifications/subscribe - Unsubscribe from notifications
POST   /api/notifications/test      - Send test notification (user's own)
```

## Environment Variables

### Development (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/habits_db"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Push Notifications
VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:your-email@example.com"

# Frontend
VITE_API_URL="http://localhost:3000/api"
```

### Production (.env.production)
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/habits_db"

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET="your-super-secret-jwt-key-production"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="https://your-domain.com"

# Push Notifications
VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:your-email@example.com"

# Frontend
VITE_API_URL="https://your-domain.com/api"
```

## Development Workflow

1. **Local Development**:
   - Start PostgreSQL locally (Docker or local install)
   - Start backend: `npm run dev:backend`
   - Start frontend: `npm run dev:frontend`
   - Run Prisma migrations: `npx prisma migrate dev`
   - Open Prisma Studio: `npx prisma studio`

2. **Database Setup**:
   - Create PostgreSQL database locally or use Docker
   - Update DATABASE_URL in .env
   - Run migrations: `npx prisma migrate dev`
   - Seed database (optional): `npx prisma db seed`

3. **Testing**:
   - Run tests: `npm test`
   - Run linting: `npm run lint`
   - Type check: `npm run type-check`

## Production Deployment

### Option 1: Platform as a Service (Recommended)
- **Render**: Easy PostgreSQL setup, free tier available
- **Railway**: Simple deployment, PostgreSQL included
- **Heroku**: Traditional choice, PostgreSQL addon
- **Vercel** (Frontend) + **Railway/Render** (Backend): Good separation

### Option 2: Self-Hosted (VPS)
- **DigitalOcean**: Droplet with Docker
- **AWS EC2**: More control, more setup
- **Linode**: Similar to DigitalOcean

### Deployment Steps
1. Set up PostgreSQL database (managed service or Docker)
2. Set up backend server (Render, Railway, or VPS)
3. Set up frontend hosting (Vercel, Netlify, or same server)
4. Configure environment variables
5. Run database migrations
6. Set up SSL/HTTPS (required for PWA)
7. Configure CORS for production domain
8. Test production deployment
9. Set up monitoring and logging

### Docker Setup
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: habits_user
      POSTGRES_PASSWORD: habits_password
      POSTGRES_DB: habits_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://habits_user:habits_password@postgres:5432/habits_db
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds (10-12)
2. **JWT Security**: Use strong secret, set expiration, use httpOnly cookies if possible
3. **SQL Injection**: Prisma handles this, but validate all inputs
4. **CORS**: Configure properly for production domain
5. **Rate Limiting**: Add rate limiting to auth endpoints
6. **Input Validation**: Validate all user inputs on backend
7. **HTTPS**: Required for PWA and push notifications
8. **Environment Variables**: Never commit secrets to git
9. **User Isolation**: Ensure users can only access their own data
10. **XSS Prevention**: Sanitize user inputs, use React's built-in XSS protection

## Next Steps After Plan Approval

1. Initialize project structure
2. Set up development environment
3. Install all dependencies
4. Set up PostgreSQL database (local or Docker)
5. Create database schema with User model
6. Implement authentication
7. Implement features phase by phase
8. Test on mobile devices
9. Deploy to production
10. Share with friends!

## Notes

- **PostgreSQL is recommended** for multi-user production apps
- Use Prisma for type-safe database access and easy migrations
- Implement proper authentication from the start
- Ensure user data isolation at all levels (database, API, UI)
- Implement offline support for PWA
- Test push notifications on real devices (Chrome/Edge required, HTTPS required)
- Consider adding export/import functionality for data backup
- May want to add habit templates for common habits
- Consider adding social features (sharing streaks with friends) in future
- Set up proper error logging and monitoring for production
- Consider adding email verification for user accounts
- Add password reset functionality
- Consider adding user profiles and settings





