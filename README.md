# Habits App

A Progressive Web App (PWA) for tracking daily habits with morning/evening categorization, calendar views, push notifications, and detailed analytics including time tracking and skip counts.

## Features

- **Multi-user support** with authentication
- **Habit management**: Add, edit, and delete habits
- **Category organization**: Organize habits by morning, evening, or other
- **Frequency tracking**: Daily or weekly habits with configurable times per day/week
- **Completion tracking**: Track when habits are completed with optional duration
- **Skip tracking**: Track when habits are skipped with optional reasons
- **Statistics**: View completion rates, streaks, and total time spent
- **Calendar views**: Visual calendar showing completion status
- **Push notifications**: Get reminded to complete your habits
- **PWA support**: Install as a mobile app

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- React Router
- PWA support with Workbox

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication
- Web Push API for notifications

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+ (or Docker)
- Git

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Habits
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL database

#### Option A: Local PostgreSQL

Create a database:

```sql
CREATE DATABASE habits_db;
```

#### Option B: Docker

```bash
docker run --name habits-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=habits_db -p 5432:5432 -d postgres:15-alpine
```

### 4. Configure environment variables

Create a `.env` file in the `backend` directory:

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
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:your-email@example.com"
```

### 5. Generate VAPID keys (for push notifications)

```bash
cd backend
npx web-push generate-vapid-keys
```

Copy the public and private keys to your `.env` file.

### 6. Run database migrations and seed

```bash
cd backend
npm run prisma:generate   # Generate Prisma Client from schema (types for DB access)
npm run prisma:migrate    # Create/update database tables to match schema
npm run prisma:seed       # Insert demo user (demo@example.com) and sample habits
```

The seed creates a **demo user** and sample habits. You can log in with:
- **Email:** `demo@example.com`
- **Password:** `password123`

Without running the seed, the demo user does not exist, so that login will fail. You can still create a new account via the Sign up page.

**Can't log in after seeding?** The **backend must be running**. In a separate terminal run `cd backend && npm run dev`. If you see *"Port 3000 is already in use"*, the backend did not start. Free the port by running `npm run kill-port` (from the `backend/` folder), then run `npm run dev` again.

### 7. Start the development servers

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

The app should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
habits-app/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── shared/            # Shared TypeScript types
└── README.md          # This file
```

## Development

### Backend Commands

```bash
cd backend
npm run dev            # Start development server
npm run kill-port      # Kill process on port 3000 (when "port already in use")
npm run build          # Build for production
npm run start          # Start production server
npm run type-check     # Type check
npm run lint           # Lint code
```

**Prisma (run from `backend/`):**

| Command | What it does |
|--------|----------------|
| `npm run prisma:generate` | Generate Prisma Client from schema (after schema changes) |
| `npm run prisma:migrate` | Apply migrations and update DB schema (`prisma migrate dev`) |
| `npm run prisma:seed` | Seed DB with demo user and sample habits |
| `npm run prisma:studio` | Open Prisma Studio to view/edit data in the browser |

### Frontend Commands

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Type check
npm run lint         # Lint code
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `GET /api/habits/:id` - Get habit by ID
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Completions
- `GET /api/habits/:habitId/completions` - Get completions for habit
- `POST /api/habits/:habitId/completions` - Mark habit complete
- `DELETE /api/completions/:id` - Remove completion

### Skips
- `GET /api/habits/:habitId/skips` - Get skips for habit
- `POST /api/habits/:habitId/skips` - Mark habit skipped
- `DELETE /api/skips/:id` - Remove skip

### Statistics
- `GET /api/statistics/habits/:habitId` - Get habit statistics
- `GET /api/statistics` - Get overall statistics

### Notifications
- `GET /api/notifications/vapid-key` - Get VAPID public key
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `DELETE /api/notifications/subscribe` - Unsubscribe from notifications
- `POST /api/notifications/test` - Send test notification

## Deployment

See `DEVELOPMENT_PLAN.md` for detailed deployment instructions.

## License

MIT
