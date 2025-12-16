# Habit Tracking App - Detailed Task Breakdown

This document breaks down the code design into detailed, actionable tasks for Cursor AI implementation. Each task is written to be clear and executable.

## Table of Contents

- [Phase 1: Project Setup & Initial Configuration](#phase-1-project-setup--initial-configuration)
- [Phase 2: Database Setup](#phase-2-database-setup)
- [Phase 3: Backend Implementation - Core Infrastructure](#phase-3-backend-implementation---core-infrastructure)
- [Phase 4: Backend Implementation - Authentication](#phase-4-backend-implementation---authentication)
- [Phase 5: Backend Implementation - Habits](#phase-5-backend-implementation---habits)
- [Phase 6: Backend Implementation - Completions & Skips](#phase-6-backend-implementation---completions--skips)
- [Phase 7: Backend Implementation - Statistics](#phase-7-backend-implementation---statistics)
- [Phase 8: Backend Implementation - Push Notifications](#phase-8-backend-implementation---push-notifications)
- [Phase 9: Backend Implementation - Route Aggregation](#phase-9-backend-implementation---route-aggregation)
- [Phase 10: Frontend Implementation - Type Definitions](#phase-10-frontend-implementation---type-definitions)
- [Phase 11: Frontend Implementation - API Services](#phase-11-frontend-implementation---api-services)
- [Phase 12: Frontend Implementation - State Management](#phase-12-frontend-implementation---state-management)
- [Phase 13: Frontend Implementation - Common Components](#phase-13-frontend-implementation---common-components)
- [Phase 14: Frontend Implementation - Auth Components](#phase-14-frontend-implementation---auth-components)
- [Phase 15: Frontend Implementation - Habit Components](#phase-15-frontend-implementation---habit-components)
- [Phase 16: Frontend Implementation - Calendar Components](#phase-16-frontend-implementation---calendar-components)
- [Phase 17: Frontend Implementation - Statistics Components](#phase-17-frontend-implementation---statistics-components)
- [Phase 18: Frontend Implementation - Notification Components](#phase-18-frontend-implementation---notification-components)
- [Phase 19: Frontend Implementation - Pages](#phase-19-frontend-implementation---pages)
- [Phase 20: Frontend Implementation - Routing & App Setup](#phase-20-frontend-implementation---routing--app-setup)
- [Phase 21: PWA Implementation](#phase-21-pwa-implementation)
- [Phase 22: Push Notifications Implementation](#phase-22-push-notifications-implementation)
- [Phase 23: Utility Functions & Helpers](#phase-23-utility-functions--helpers)
- [Phase 24: Styling & UI Polish](#phase-24-styling--ui-polish)
- [Phase 25: Error Handling & Loading States](#phase-25-error-handling--loading-states)
- [Phase 26: Testing & Validation](#phase-26-testing--validation)
- [Phase 27: Environment Configuration & Deployment Prep](#phase-27-environment-configuration--deployment-prep)
- [Phase 28: Documentation & Final Polish](#phase-28-documentation--final-polish)
- [Notes for Implementation](#notes-for-implementation)

---

## Phase 1: Project Setup & Initial Configuration

### Task 1.1: Initialize Backend Project
**Subtasks:**
- [x] 1. Create `backend/` directory in project root
- [x] 2. Initialize npm project: `cd backend && npm init -y`
- [x] 3. Install TypeScript and dependencies:
   - `npm install typescript @types/node @types/express ts-node --save-dev`
   - `npm install express cors helmet dotenv`
   - `npm install prisma @prisma/client`
   - `npm install jsonwebtoken bcrypt web-push zod`
   - `npm install @types/jsonwebtoken @types/bcrypt @types/web-push --save-dev`
- [x] 4. Create `backend/tsconfig.json` with TypeScript configuration:
   - Set `target: "ES2020"`
   - Set `module: "commonjs"`
   - Set `outDir: "./dist"`
   - Enable `strict: true`
   - Include `src/**/*`
- [x] 5. Create `backend/.env` file with placeholder values:
   - `DATABASE_URL="postgresql://user:password@localhost:5432/habits"`
   - `JWT_SECRET="your-secret-key-here"`
   - `CORS_ORIGIN="http://localhost:5173"`
   - `VAPID_PUBLIC_KEY=""`
   - `VAPID_PRIVATE_KEY=""`
   - `VAPID_SUBJECT=""`
- [x] 6. Create `backend/.env.example` file with same keys but empty/example values
- [x] 7. Add scripts to `backend/package.json`:
   - `"dev": "ts-node src/server.ts"`
   - `"build": "tsc"`
   - `"start": "node dist/server.ts"`
   - `"prisma:generate": "prisma generate"`
   - `"prisma:migrate": "prisma migrate dev"`
   - `"prisma:studio": "prisma studio"`

### Task 1.2: Initialize Frontend Project
**Subtasks:**
- [x] 1. Create `frontend/` directory in project root
- [x] 2. Initialize Vite React TypeScript project: `cd frontend && npm create vite@latest . -- --template react-ts`
- [x] 3. Install additional dependencies:
   - `npm install zustand react-router-dom date-fns axios`
   - `npm install @headlessui/react` or `npm install @radix-ui/react-dialog @radix-ui/react-select`
   - `npm install workbox-window --save-dev`
- [x] 4. Install Tailwind CSS:
   - `npm install -D tailwindcss postcss autoprefixer`
   - Run `npx tailwindcss init -p`
   - Configure `tailwind.config.js` with content paths: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
   - Add Tailwind directives to `src/index.css`: `@tailwind base; @tailwind components; @tailwind utilities;`
- [x] 5. Create `frontend/.env` file:
   - `VITE_API_URL="http://localhost:3000/api"`
- [x] 6. Create `frontend/.env.example` with same structure
- [x] 7. Update `frontend/vite.config.ts` to configure PWA settings (if using vite-plugin-pwa)

### Task 1.3: Create Directory Structures
**Backend Structure:**
- [x] 1. Create `backend/src/` directory
- [x] 2. Create subdirectories:
   - `backend/src/routes/`
   - `backend/src/controllers/`
   - `backend/src/services/`
   - `backend/src/middleware/`
   - `backend/src/utils/`
   - `backend/src/types/`
- [x] 3. Create `backend/prisma/` directory
- [x] 4. Create `backend/prisma/migrations/` directory (empty, Prisma will populate)

**Frontend Structure:**
- [x] 1. Create subdirectories in `frontend/src/`:
   - `frontend/src/components/`
   - `frontend/src/components/auth/`
   - `frontend/src/components/habits/`
   - `frontend/src/components/calendar/`
   - `frontend/src/components/statistics/`
   - `frontend/src/components/notifications/`
   - `frontend/src/components/common/`
   - `frontend/src/pages/`
   - `frontend/src/hooks/`
   - `frontend/src/store/`
   - `frontend/src/services/`
   - `frontend/src/utils/`
   - `frontend/src/types/`
- [x] 2. Create `frontend/public/` directory
- [x] 3. Create `frontend/public/icons/` directory for PWA icons

---

## Phase 2: Database Setup

### Task 2.1: Initialize Prisma
**Subtasks:**
- [x] 1. Initialize Prisma in backend: `cd backend && npx prisma init`
- [x] 2. Verify `backend/prisma/schema.prisma` file exists
- [x] 3. Configure Prisma schema (Prisma 7):
   - Set `provider = "prisma-client-js"` in generator
   - Set `provider = "postgresql"` in datasource
   - Note: In Prisma 7, `url` is NOT in schema.prisma - it's in `prisma.config.ts`
- [x] 4. Configure `backend/prisma.config.ts`:
   - Set `datasource.url` to `process.env.DATABASE_URL`
   - This file is used by Prisma Migrate

### Task 2.2: Create Prisma Schema Models
**Subtasks:**
- [x] 1. Define `User` model in `backend/prisma/schema.prisma`:
   - Add `id String @id @default(cuid())`
   - Add `email String @unique`
   - Add `password String`
   - Add `name String?`
   - Add `createdAt DateTime @default(now())`
   - Add `updatedAt DateTime @updatedAt`
   - Add `habits Habit[]` relation
   - Add `subscriptions NotificationSubscription[]` relation
   - Add `@@index([email])`
   - Add `@@map("users")`
- [x] 2. Define `HabitCategory` enum:
   - Values: `MORNING`, `EVENING`, `OTHER`
- [x] 3. Define `HabitFrequency` enum:
   - Values: `DAILY`, `WEEKLY`
- [x] 4. Define `Habit` model:
   - Add `id String @id @default(cuid())`
   - Add `userId String`
   - Add `name String`
   - Add `description String?`
   - Add `category HabitCategory`
   - Add `frequency HabitFrequency`
   - Add `timesPerWeek Int?`
   - Add `timesPerDay Int?`
   - Add `timesPerMonth Int?`
   - Add `reminderTime String?`
   - Add `createdAt DateTime @default(now())`
   - Add `updatedAt DateTime @updatedAt`
   - Add `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
   - Add `completions HabitCompletion[]` relation
   - Add `skips HabitSkip[]` relation
   - Add `subscriptions NotificationSubscription[]` relation
   - Add `@@index([userId])`
   - Add `@@index([userId, category])`
   - Add `@@map("habits")`
- [x] 5. Define `HabitCompletion` model:
   - Add `id String @id @default(cuid())`
   - Add `habitId String`
   - Add `date DateTime @db.Date`
   - Add `duration Int?`
   - Add `notes String?`
   - Add `completedAt DateTime @default(now())`
   - Add `habit Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)`
   - Add `@@unique([habitId, date])`
   - Add `@@index([habitId, date])`
   - Add `@@index([habitId])`
   - Add `@@map("habit_completions")`
- [x] 6. Define `HabitSkip` model:
   - Add `id String @id @default(cuid())`
   - Add `habitId String`
   - Add `date DateTime @db.Date`
   - Add `reason String?`
   - Add `skippedAt DateTime @default(now())`
   - Add `habit Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)`
   - Add `@@unique([habitId, date])`
   - Add `@@index([habitId, date])`
   - Add `@@index([habitId])`
   - Add `@@map("habit_skips")`
- [x] 7. Define `NotificationSubscription` model:
   - Add `id String @id @default(cuid())`
   - Add `userId String`
   - Add `habitId String?`
   - Add `endpoint String @unique`
   - Add `keys Json`
   - Add `createdAt DateTime @default(now())`
   - Add `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
   - Add `habit Habit? @relation(fields: [habitId], references: [id], onDelete: Cascade)`
   - Add `@@index([userId])`
   - Add `@@index([habitId])`
   - Add `@@map("notification_subscriptions")`

### Task 2.3: Generate Prisma Client and Run Migrations
**Subtasks:**
- [x] 1. Generate Prisma Client: `cd backend && npx prisma generate`
- [x] 2. Set up local PostgreSQL database:
   - Install PostgreSQL (or use existing installation)
   - Start PostgreSQL service: `brew services start postgresql`
   - Create database: `psql postgres` then `CREATE DATABASE habits_db;`
   - Create `.env` file in `backend/` with `DATABASE_URL="postgresql://username@localhost:5432/habits_db"`
- [x] 3. Create initial migration: `npx prisma migrate dev --name init`
   - Migration created: `prisma/migrations/20251126155722_test/`
   - Database tables created successfully
- [x] 4. Verify migration files created in `backend/prisma/migrations/`
- [x] 5. Create `backend/src/utils/prisma.ts` file:
   - Import `PrismaClient` from `@prisma/client`
   - Create singleton instance: `export const prisma = new PrismaClient()`
   - Note: In Prisma 7, PrismaClient automatically reads DATABASE_URL from environment
   - Add error handling for connection
   - Export the prisma instance
- [x] 6. Database connection verified - can view with `npm run prisma:studio`

---

## Phase 3: Backend Implementation - Core Infrastructure

### Task 3.1: Create Backend Type Definitions
**Subtasks:**
- [x] 1. Create `backend/src/types/index.ts`
- [x] 2. Define backend-specific types:
  - Export types from Prisma: `export * from '@prisma/client'`
  - Add any additional backend-specific type definitions if needed

### Task 3.2: Create Utility Functions
**Subtasks:**
- [x] 1. Create `backend/src/utils/jwt.util.ts`:
  - Import `jsonwebtoken` and types
  - Create `generateToken(userId: string): string` function
    - Use `jwt.sign()` with userId payload
    - Use `process.env.JWT_SECRET`
    - Set expiration (e.g., 7 days)
  - Create `verifyToken(token: string): { userId: string }` function
    - Use `jwt.verify()` to verify and decode token
    - Return decoded payload with userId
    - Handle errors appropriately
- [x] 2. Create `backend/src/utils/bcrypt.util.ts`:
  - Import `bcrypt`
  - Create `hashPassword(password: string): Promise<string>` function
    - Use `bcrypt.hash()` with 10-12 salt rounds
  - Create `comparePassword(password: string, hash: string): Promise<boolean>` function
    - Use `bcrypt.compare()` to verify password
- [x] 3. Create `backend/src/utils/validation.util.ts`:
  - Import `zod`
  - Create Zod schemas for validation:
    - `registerSchema`: email, password, name (optional)
    - `loginSchema`: email, password
    - `createHabitSchema`: name, category, frequency, etc.
    - `updateHabitSchema`: all fields optional
    - `completionSchema`: date, duration (optional), notes (optional)
    - `skipSchema`: date, reason (optional)
- [x] 4. Create `backend/src/utils/logger.util.ts`:
  - Set up basic logging utility (can use console.log for now, or winston if preferred)
  - Create functions: `logInfo()`, `logError()`, `logWarn()`

### Task 3.3: Create Authentication Middleware
**Subtasks:**
- [x] 1. Create `backend/src/middleware/auth.middleware.ts`:
   - Import `Request`, `Response`, `NextFunction` from express
   - Import `jwt` and `verifyToken` utility
   - Import `prisma` from utils
   - Define `AuthRequest` interface extending `Request`:
     - Add `userId?: string`
     - Add `user?: { id: string; email: string; name?: string }`
   - Create `authenticate` async middleware function:
     - Extract token from `req.headers.authorization` (remove "Bearer " prefix)
     - If no token, return 401 with error message
     - Verify token using `verifyToken()` utility
     - Query database for user using `prisma.user.findUnique()`
     - If user not found, return 401
     - Attach `userId` and `user` to `req` object
     - Call `next()`
     - Handle errors and return 401 for invalid tokens

### Task 3.4: Create Error Handling Middleware
**Subtasks:**
- [x] 1. Create `backend/src/middleware/error-handler.middleware.ts`:
   - Import `Request`, `Response`, `NextFunction`, `ErrorRequestHandler` from express
   - Create `errorHandler` middleware:
     - Accept `err`, `req`, `res`, `next` parameters
     - Log error to console/logger
     - Set status code (default 500)
     - Return JSON response with error message
     - Handle specific error types (Prisma errors, validation errors, etc.)

### Task 3.5: Create Validation Middleware
**Subtasks:**
- [x] 1. Create `backend/src/middleware/validation.middleware.ts`:
   - Import `Request`, `Response`, `NextFunction` from express
   - Import Zod schemas from validation util
   - Create generic `validate` function that accepts a Zod schema:
     - Return middleware function
     - Use `safeParse()` to validate `req.body` with schema (safer, non-throwing approach)
     - If validation fails, pass `result.error` (ZodError) to `next()` to delegate to error-handler middleware
     - If valid, replace `req.body` with validated data (`result.data`) and call `next()`
     - Updated: Now delegates error handling to centralized error-handler middleware instead of handling directly
   - Export specific validators: `validateRegister`, `validateLogin`, `validateCreateHabit`, etc.

### Task 3.6: Create Rate Limiting Middleware (Optional but Recommended)
**Subtasks:**
- [x] 1. Install `express-rate-limit`: `npm install express-rate-limit`
- [x] 2. Create `backend/src/middleware/rate-limiter.middleware.ts`:
   - Import `rateLimit` from `express-rate-limit`
   - Create `apiLimiter` rate limiter instance:
     - Set `windowMs` to 15 minutes (15 * 60 * 1000)
     - Set `max` requests to 100 per window
     - Configure standard headers and message
   - Create `authLimiter` rate limiter instance:
     - Set `windowMs` to 15 minutes
     - Set `max` requests to 5 per window (more restrictive for auth endpoints)
     - Enable `skipSuccessfulRequests` to prevent counting successful auth attempts
   - Export both rate limiter middlewares

### Task 3.7: Create Express App Setup
**Subtasks:**
- [x] 1. Create `backend/src/app.ts`:
   - Import `express`
   - Import `cors`, `helmet`
   - Import error handler middleware
   - Import routes (will create next)
   - Create Express app instance: `const app = express()`
   - Add `helmet()` middleware for security
   - Add `cors()` middleware:
     - Set `origin` from `process.env.CORS_ORIGIN`
     - Set `credentials: true`
   - Add `express.json()` middleware
   - Add `express.urlencoded({ extended: true })` middleware
   - Add routes: `app.use('/api', routes)`
   - Add error handler middleware (must be last)
   - Export `app` as default

### Task 3.8: Create Server Entry Point
**Subtasks:**
- [x] 1. Create `backend/src/server.ts`:
   - Import `app` from `./app`
   - Import `dotenv` and call `config()`
   - Get `PORT` from `process.env.PORT` or default to 3000
   - Start server: `app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })`
   - Add error handling for server startup

---

## Phase 4: Backend Implementation - Authentication

### Task 4.1: Create Authentication Service
**Subtasks:**
- [x] 1. Create `backend/src/services/auth.service.ts`:
   - Import `prisma` from utils
   - Import `hashPassword`, `comparePassword` from bcrypt util
   - Import `generateToken` from jwt util
   - Create `register` async function:
     - Accept `email`, `password`, `name?` parameters
     - Check if user exists with `prisma.user.findUnique({ where: { email } })`
     - If exists, throw error "User already exists"
     - Hash password using `hashPassword()`
     - Create user with `prisma.user.create()`:
       - Include email, hashed password, name
     - Generate JWT token using `generateToken(user.id)`
     - Return `{ user: { id, email, name }, token }`
   - Create `login` async function:
     - Accept `email`, `password` parameters
     - Find user with `prisma.user.findUnique({ where: { email } })`
     - If not found, throw error "Invalid credentials"
     - Compare password using `comparePassword()`
     - If password doesn't match, throw error "Invalid credentials"
     - Generate JWT token
     - Return `{ user: { id, email, name }, token }`
   - Create `getUserById` async function:
     - Accept `userId` parameter
     - Find user with `prisma.user.findUnique()`
     - Return user (without password) or null
   - Export service object with all functions

### Task 4.2: Create Authentication Controller
**Subtasks:**
- [x] 1. Create `backend/src/controllers/auth.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from auth middleware
   - Import `authService` from services
   - Create `register` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract `email`, `password`, `name` from `req.body`
     - Call `authService.register()`
     - Return 201 status with user and token
     - Handle errors and return appropriate status codes
   - Create `login` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract `email`, `password` from `req.body`
     - Call `authService.login()`
     - Return 200 status with user and token
     - Handle errors
   - Create `getMe` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Use `req.user` (set by auth middleware)
     - Return 200 status with user data
   - Export controller object with all functions

### Task 4.3: Create Authentication Routes
**Subtasks:**
- [x] 1. Create `backend/src/routes/auth.routes.ts`:
   - Import `Router` from express
   - Import auth controller
   - Import validation middleware
   - Import `authenticate` middleware
   - Create router: `const router = Router()`
   - Define `POST /register` route:
     - Use `validateRegister` middleware
     - Use `authController.register`
   - Define `POST /login` route:
     - Use `validateLogin` middleware
     - Use `authController.login`
   - Define `GET /me` route:
     - Use `authenticate` middleware
     - Use `authController.getMe`
   - Export router as default

---

## Phase 5: Backend Implementation - Habits

### Task 5.1: Create Habit Service
**Subtasks:**
- [x] 1. Create `backend/src/services/habit.service.ts`:
   - Import `prisma` from utils
   - Import Prisma types
   - Create `getUserHabits` async function:
     - Accept `userId: string`
     - Query `prisma.habit.findMany({ where: { userId } })`
     - Order by `createdAt desc`
     - Return habits array
   - Create `getHabitById` async function:
     - Accept `userId: string`, `habitId: string`
     - Query `prisma.habit.findFirst({ where: { id: habitId, userId } })`
     - Return habit or null
   - Create `createHabit` async function:
     - Accept `userId: string`, `data: CreateHabitDto`
     - Create habit with `prisma.habit.create()`:
       - Include all fields from data
       - Set `userId`
     - Return created habit
   - Create `updateHabit` async function:
     - Accept `userId: string`, `habitId: string`, `data: UpdateHabitDto`
     - Verify habit belongs to user (find first)
     - If not found, return null
     - Update habit with `prisma.habit.update()`
     - Return updated habit
   - Create `deleteHabit` async function:
     - Accept `userId: string`, `habitId: string`
     - Verify habit belongs to user
     - If not found, return false
     - Delete habit with `prisma.habit.delete()`
     - Return true
   - Export service object

### Task 5.2: Create Habit Controller
**Subtasks:**
- [x] 1. Create `backend/src/controllers/habit.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from middleware
   - Import `habitService` from services
   - Create `getAll` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Call `habitService.getUserHabits(req.userId!)`
     - Return JSON response with habits
   - Create `getById` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract `id` from `req.params`
     - Call `habitService.getHabitById(req.userId!, id)`
     - If not found, return 404
     - Return JSON response with habit
   - Create `create` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract data from `req.body`
     - Call `habitService.createHabit(req.userId!, data)`
     - Return 201 status with created habit
   - Create `update` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract `id` from `req.params` and data from `req.body`
     - Call `habitService.updateHabit(req.userId!, id, data)`
     - If not found, return 404
     - Return JSON response with updated habit
   - Create `delete` async function:
     - Accept `req: AuthRequest`, `res: Response`
     - Extract `id` from `req.params`
     - Call `habitService.deleteHabit(req.userId!, id)`
     - If not found, return 404
     - Return 204 status (no content)
   - Export controller object

### Task 5.3: Create Habit Routes
**Subtasks:**
- [x] 1. Create `backend/src/routes/habits.routes.ts`:
   - Import `Router` from express
   - Import habit controller
   - Import `authenticate` middleware
   - Import validation middleware
   - Create router
   - Apply `authenticate` middleware to all routes
   - Define `GET /` route → `habitController.getAll`
   - Define `GET /:id` route → `habitController.getById`
   - Define `POST /` route:
     - Use `validateCreateHabit` middleware
     - Use `habitController.create`
   - Define `PUT /:id` route:
     - Use `validateUpdateHabit` middleware
     - Use `habitController.update`
   - Define `DELETE /:id` route → `habitController.delete`
   - Export router

---

## Phase 6: Backend Implementation - Completions & Skips

### Task 6.1: Create Completion Service
**Subtasks:**
- [x] 1. Create `backend/src/services/completion.service.ts`:
   - Import `prisma` from utils
   - Create `createCompletion` async function:
     - Accept `userId: string`, `habitId: string`, `data: { date: string, duration?: number, notes?: string }`
     - Verify habit belongs to user
     - Check if completion already exists for that date
     - Create completion with `prisma.habitCompletion.create()`
     - Return created completion
   - Create `getCompletions` async function:
     - Accept `userId: string`, `habitId: string`, `startDate?: string`, `endDate?: string`
     - Verify habit belongs to user
     - Build where clause with date range if provided
     - Query `prisma.habitCompletion.findMany()`
     - Return completions array
   - Create `deleteCompletion` async function:
     - Accept `userId: string`, `completionId: string`
     - Find completion and verify habit belongs to user
     - Delete completion
     - Return true if deleted, false if not found
   - Export service object

### Task 6.2: Create Completion Controller
**Subtasks:**
- [x] 1. Create `backend/src/controllers/completion.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from middleware
   - Import `completionService` from services
   - Create `create` async function:
     - Extract `habitId` from `req.params`
     - Extract data from `req.body`
     - Call `completionService.createCompletion()`
     - Return 201 status with completion
   - Create `getAll` async function:
     - Extract `habitId` from `req.params`
     - Extract query params: `startDate`, `endDate`
     - Call `completionService.getCompletions()`
     - Return JSON response
   - Create `delete` async function:
     - Extract `id` from `req.params`
     - Call `completionService.deleteCompletion()`
     - Return 204 if deleted, 404 if not found
   - Export controller object

### Task 6.3: Create Completion Routes
**Subtasks:**
- [x] 1. Create `backend/src/routes/completions.routes.ts`:
   - Import `Router` from express
   - Import completion controller
   - Import `authenticate` middleware
   - Import validation middleware
   - Create router
   - Apply `authenticate` middleware
   - Define `POST /habits/:habitId/completions` route:
     - Use `validateCompletion` middleware
     - Use `completionController.create`
   - Define `GET /habits/:habitId/completions` route:
     - Use `completionController.getAll`
   - Define `DELETE /completions/:id` route:
     - Use `completionController.delete`
   - Export router

### Task 6.4: Create Skip Service
**Subtasks:**
- [x] 1. Create `backend/src/services/skip.service.ts`:
   - Import `prisma` from utils
   - Create `createSkip` async function:
     - Accept `userId: string`, `habitId: string`, `data: { date: string, reason?: string }`
     - Verify habit belongs to user
     - Check if skip already exists for that date
     - Create skip with `prisma.habitSkip.create()`
     - Return created skip
   - Create `getSkips` async function:
     - Accept `userId: string`, `habitId: string`, `startDate?: string`, `endDate?: string`
     - Verify habit belongs to user
     - Query skips with date range if provided
     - Return skips array
   - Create `deleteSkip` async function:
     - Accept `userId: string`, `skipId: string`
     - Find skip and verify habit belongs to user
     - Delete skip
     - Return true/false
   - Export service object

### Task 6.5: Create Skip Controller
**Subtasks:**
- [x] 1. Create `backend/src/controllers/skip.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from middleware
   - Import `skipService` from services
   - Create `create` async function:
     - Extract `habitId` from `req.params`
     - Extract data from `req.body`
     - Call `skipService.createSkip()`
     - Return 201 status
   - Create `getAll` async function:
     - Extract `habitId` from `req.params`
     - Extract query params
     - Call `skipService.getSkips()`
     - Return JSON response
   - Create `delete` async function:
     - Extract `id` from `req.params`
     - Call `skipService.deleteSkip()`
     - Return 204 or 404
   - Export controller object

### Task 6.6: Create Skip Routes
**Subtasks:**
- [x] 1. Create `backend/src/routes/skips.routes.ts`:
   - Import `Router` from express
   - Import skip controller
   - Import `authenticate` middleware
   - Import validation middleware
   - Create router
   - Apply `authenticate` middleware
   - Define `POST /habits/:habitId/skips` route:
     - Use `validateSkip` middleware
     - Use `skipController.create`
   - Define `GET /habits/:habitId/skips` route:
     - Use `skipController.getAll`
   - Define `DELETE /skips/:id` route:
     - Use `skipController.delete`
   - Export router

---

## Phase 7: Backend Implementation - Statistics

### Task 7.1: Create Analytics Service
**Subtasks:**
- [ ] 1. Create `backend/src/services/analytics.service.ts`:
   - Import `prisma` from utils
   - Create `calculateStreak` helper function:
     - Accept completions and skips arrays
     - Sort by date descending
     - Count consecutive days with completion from today backwards
     - Stop when hitting a skip or missing day
     - Return streak count
   - Create `calculateLongestStreak` helper function:
     - Accept completions and skips arrays
     - Find all sequences of consecutive completions
     - Return the longest sequence length
   - Create `getHabitStatistics` async function:
     - Accept `userId: string`, `habitId: string`
     - Find habit with completions and skips included
     - If not found, return null
     - Calculate:
       - `totalCompletions`: length of completions array
       - `totalSkips`: length of skips array
       - `totalTime`: sum of all completion durations
       - `completionRate`: (completions / (completions + skips)) * 100
       - `currentStreak`: call `calculateStreak()`
       - `longestStreak`: call `calculateLongestStreak()`
     - Return statistics object
   - Create `getUserStatistics` async function:
     - Accept `userId: string`
     - Find all habits with completions and skips
     - Calculate totals across all habits:
       - `totalHabits`: count of habits
       - `totalCompletions`: sum of all completions
       - `totalSkips`: sum of all skips
       - `totalTime`: sum of all durations
       - `averageCompletionRate`: average across all habits
     - Return statistics object
   - Export service object

### Task 7.2: Create Statistics Controller
**Subtasks:**
- [ ] 1. Create `backend/src/controllers/statistics.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from middleware
   - Import `analyticsService` from services
   - Create `getHabitStatistics` async function:
     - Extract `habitId` from `req.params`
     - Call `analyticsService.getHabitStatistics()`
     - If null, return 404
     - Return JSON response with statistics
   - Create `getUserStatistics` async function:
     - Call `analyticsService.getUserStatistics()`
     - Return JSON response with statistics
   - Export controller object

### Task 7.3: Create Statistics Routes
**Subtasks:**
- [ ] 1. Create `backend/src/routes/statistics.routes.ts`:
   - Import `Router` from express
   - Import statistics controller
   - Import `authenticate` middleware
   - Create router
   - Apply `authenticate` middleware
   - Define `GET /habits/:habitId/statistics` route:
     - Use `statisticsController.getHabitStatistics`
   - Define `GET /statistics` route:
     - Use `statisticsController.getUserStatistics`
   - Export router

---

## Phase 8: Backend Implementation - Push Notifications

### Task 8.1: Generate VAPID Keys
**Subtasks:**
- [ ] 1. Install web-push if not already: `npm install web-push`
- [ ] 2. Create script or run command to generate VAPID keys:
   - Run: `npx web-push generate-vapid-keys`
   - Copy public key to `VAPID_PUBLIC_KEY` in `.env`
   - Copy private key to `VAPID_PRIVATE_KEY` in `.env`
   - Set `VAPID_SUBJECT` to mailto URL (e.g., `mailto:admin@example.com`)

### Task 8.2: Create Push Notification Service
**Subtasks:**
- [ ] 1. Create `backend/src/services/push-notification.service.ts`:
   - Import `webpush` from `web-push`
   - Import `prisma` from utils
   - Import `format` from `date-fns` (install if needed: `npm install date-fns`)
   - Configure webpush:
     - Set VAPID details from environment variables
     - Call `webpush.setVapidDetails()`
   - Create `sendHabitReminder` async function:
     - Accept `habitId: string`, `message: string`
     - Find all subscriptions for habit
     - Create payload JSON: `{ title: 'Habit Reminder', body: message, habitId }`
     - Loop through subscriptions:
       - Try to send notification with `webpush.sendNotification()`
       - If error status 410 (expired), delete subscription
       - Handle other errors appropriately
   - Create `checkAndSendReminders` async function:
     - Get current time in HH:mm format
     - Find habits with matching `reminderTime` and subscriptions
     - For each habit:
       - Check if already completed today
       - If not completed, call `sendHabitReminder()`
   - Export service object

### Task 8.3: Create Notification Controller
**Subtasks:**
- [ ] 1. Create `backend/src/controllers/notification.controller.ts`:
   - Import `Response` from express
   - Import `AuthRequest` from middleware
   - Import `prisma` from utils
   - Create `getVapidKey` async function:
     - Return public VAPID key from environment
   - Create `subscribe` async function:
     - Extract subscription data from `req.body`
     - Extract optional `habitId` from `req.body`
     - Create notification subscription in database:
       - Store endpoint, keys (as JSON), userId, habitId
     - Return 201 status
   - Create `unsubscribe` async function:
     - Extract endpoint from `req.body`
     - Delete subscription by endpoint and userId
     - Return 204 status
   - Export controller object

### Task 8.4: Create Notification Routes
**Subtasks:**
- [ ] 1. Create `backend/src/routes/notifications.routes.ts`:
   - Import `Router` from express
   - Import notification controller
   - Import `authenticate` middleware
   - Create router
   - Apply `authenticate` middleware
   - Define `GET /vapid-key` route:
     - Use `notificationController.getVapidKey`
   - Define `POST /subscribe` route:
     - Use `notificationController.subscribe`
   - Define `POST /unsubscribe` route:
     - Use `notificationController.unsubscribe`
   - Export router

### Task 8.5: Set Up Cron Job for Notifications (Optional)
**Subtasks:**
- [ ] 1. Install cron library: `npm install node-cron` and `npm install @types/node-cron --save-dev`
- [ ] 2. Create `backend/src/services/cron.service.ts`:
   - Import `cron` from `node-cron`
   - Import `pushNotificationService` from services
   - Create function to start cron jobs:
     - Schedule job to run every minute: `cron.schedule('* * * * *', ...)`
     - Call `pushNotificationService.checkAndSendReminders()`
   - Export function
- [ ] 3. Call cron service startup in `backend/src/server.ts`

---

## Phase 9: Backend Implementation - Route Aggregation

### Task 9.1: Create Main Routes File
**Subtasks:**
- [ ] 1. Create `backend/src/routes/index.ts`:
   - Import `Router` from express
   - Import all route modules:
     - `authRoutes` from `./auth.routes`
     - `habitRoutes` from `./habits.routes`
     - `completionRoutes` from `./completions.routes`
     - `skipRoutes` from `./skips.routes`
     - `statisticsRoutes` from `./statistics.routes`
     - `notificationRoutes` from `./notifications.routes`
   - Create main router: `const router = Router()`
   - Mount all routes:
     - `router.use('/auth', authRoutes)`
     - `router.use('/habits', habitRoutes)`
     - `router.use('/habits', completionRoutes)`
     - `router.use('/habits', skipRoutes)`
     - `router.use('/habits', statisticsRoutes)`
     - `router.use('/statistics', statisticsRoutes)` (for user stats)
     - `router.use('/notifications', notificationRoutes)`
   - Export router as default

---

## Phase 10: Frontend Implementation - Type Definitions

### Task 10.1: Create Frontend Type Definitions
**Subtasks:**
- [ ] 1. Create `frontend/src/types/index.ts`:
   - Define `HabitCategory` type: `'MORNING' | 'EVENING' | 'OTHER'`
   - Define `HabitFrequency` type: `'DAILY' | 'WEEKLY'`
   - Define `User` interface:
     - `id: string`
     - `email: string`
     - `name?: string`
   - Define `Habit` interface:
     - All fields matching backend model
     - Use string for dates (ISO format)
   - Define `HabitCompletion` interface:
     - All fields matching backend model
   - Define `HabitSkip` interface:
     - All fields matching backend model
   - Define `HabitStatistics` interface:
     - All statistics fields
   - Define `CreateHabitDto` interface:
     - All fields for creating habit (no id, timestamps)
   - Define `UpdateHabitDto` type:
     - `Partial<CreateHabitDto>`
   - Export all types

---

## Phase 11: Frontend Implementation - API Services

### Task 11.1: Create API Client
**Subtasks:**
- [ ] 1. Create `frontend/src/services/api.ts`:
   - Import `axios` from `axios`
   - Get `VITE_API_URL` from environment
   - Create axios instance:
     - Set `baseURL` to `VITE_API_URL`
     - Set default headers: `Content-Type: application/json`
   - Add request interceptor:
     - Get token from localStorage (or auth store)
     - Add `Authorization: Bearer ${token}` header if token exists
   - Add response interceptor:
     - Handle 401 errors (unauthorized) - clear token and redirect to login
     - Handle other errors appropriately
   - Export axios instance

### Task 11.2: Create Auth Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/authService.ts`:
   - Import `api` from `./api`
   - Import `User` type
   - Create `register` async function:
     - Accept `email`, `password`, `name?` parameters
     - POST to `/auth/register`
     - Return `{ user, token }`
   - Create `login` async function:
     - Accept `email`, `password` parameters
     - POST to `/auth/login`
     - Return `{ user, token }`
   - Create `getMe` async function:
     - GET `/auth/me`
     - Return user object
   - Create `logout` function:
     - Clear token from localStorage
   - Export service object

### Task 11.3: Create Habit Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/habitService.ts`:
   - Import `api` from `./api`
   - Import `Habit`, `CreateHabitDto`, `UpdateHabitDto` types
   - Create `getAll` async function:
     - GET `/habits`
     - Return `Habit[]`
   - Create `getById` async function:
     - Accept `id: string`
     - GET `/habits/${id}`
     - Return `Habit`
   - Create `create` async function:
     - Accept `data: CreateHabitDto`
     - POST `/habits` with data
     - Return `Habit`
   - Create `update` async function:
     - Accept `id: string`, `data: UpdateHabitDto`
     - PUT `/habits/${id}` with data
     - Return `Habit`
   - Create `delete` async function:
     - Accept `id: string`
     - DELETE `/habits/${id}`
     - Return void
   - Export service object

### Task 11.4: Create Completion Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/completionService.ts`:
   - Import `api` from `./api`
   - Import `HabitCompletion` type
   - Create `create` async function:
     - Accept `habitId: string`, `data: { date: string, duration?: number, notes?: string }`
     - POST `/habits/${habitId}/completions` with data
     - Return `HabitCompletion`
   - Create `getAll` async function:
     - Accept `habitId: string`, `startDate?: string`, `endDate?: string`
     - Build query string if dates provided
     - GET `/habits/${habitId}/completions?${query}`
     - Return `HabitCompletion[]`
   - Create `delete` async function:
     - Accept `id: string`
     - DELETE `/completions/${id}`
     - Return void
   - Export service object

### Task 11.5: Create Skip Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/skipService.ts`:
   - Import `api` from `./api`
   - Import `HabitSkip` type
   - Create `create` async function:
     - Accept `habitId: string`, `data: { date: string, reason?: string }`
     - POST `/habits/${habitId}/skips` with data
     - Return `HabitSkip`
   - Create `getAll` async function:
     - Accept `habitId: string`, `startDate?: string`, `endDate?: string`
     - GET with query params
     - Return `HabitSkip[]`
   - Create `delete` async function:
     - Accept `id: string`
     - DELETE `/skips/${id}`
     - Return void
   - Export service object

### Task 11.6: Create Statistics Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/statisticsService.ts`:
   - Import `api` from `./api`
   - Import `HabitStatistics` type
   - Create `getHabitStatistics` async function:
     - Accept `habitId: string`
     - GET `/habits/${habitId}/statistics`
     - Return `HabitStatistics`
   - Create `getUserStatistics` async function:
     - GET `/statistics`
     - Return user statistics object
   - Export service object

### Task 11.7: Create Push Notification Service
**Subtasks:**
- [ ] 1. Create `frontend/src/services/pushNotificationService.ts`:
   - Import `api` from `./api`
   - Create `getVapidKey` async function:
     - GET `/notifications/vapid-key`
     - Return `{ publicKey: string }`
   - Create `subscribe` async function:
     - Accept `subscription: PushSubscription`, `habitId?: string`
     - POST `/notifications/subscribe` with subscription and habitId
     - Return void
   - Create `unsubscribe` async function:
     - Accept `endpoint: string`
     - POST `/notifications/unsubscribe` with endpoint
     - Return void
   - Create `requestPermission` async function:
     - Check if `Notification` API is available
     - Request permission using `Notification.requestPermission()`
     - Return permission result
   - Create `subscribeToPush` async function:
     - Get VAPID key
     - Get service worker registration
     - Call `registration.pushManager.subscribe()` with VAPID key
     - Return subscription
   - Export service object

---

## Phase 12: Frontend Implementation - State Management

### Task 12.1: Create Auth Store
**Subtasks:**
- [ ] 1. Create `frontend/src/store/authStore.ts`:
   - Import `create` from `zustand`
   - Import `User` type
   - Import `authService` from services
   - Define `AuthState` interface:
     - `user: User | null`
     - `token: string | null`
     - `isAuthenticated: boolean`
     - `loading: boolean`
     - `error: string | null`
     - Actions: `login`, `register`, `logout`, `checkAuth`, `clearError`
   - Create store with `create<AuthState>()`:
     - Initialize state from localStorage (token, user)
     - Set `isAuthenticated` based on token existence
     - Implement `login` action:
       - Set loading true
       - Call `authService.login()`
       - Save token and user to localStorage
       - Update state
       - Set loading false
     - Implement `register` action:
       - Similar to login
     - Implement `logout` action:
       - Clear token and user from localStorage
       - Reset state
     - Implement `checkAuth` action:
       - If token exists, call `authService.getMe()`
       - Update user in state
     - Implement `clearError` action
   - Export `useAuthStore` hook

### Task 12.2: Create Habit Store
**Subtasks:**
- [ ] 1. Create `frontend/src/store/habitStore.ts`:
   - Import `create` from `zustand`
   - Import habit-related types
   - Import habit services
   - Define `HabitState` interface:
     - `habits: Habit[]`
     - `selectedHabit: Habit | null`
     - `completions: Record<string, HabitCompletion[]>`
     - `skips: Record<string, HabitSkip[]>`
     - `statistics: Record<string, HabitStatistics>`
     - `loading: boolean`
     - `error: string | null`
     - Actions: `fetchHabits`, `fetchHabitById`, `createHabit`, `updateHabit`, `deleteHabit`, `fetchCompletions`, `markComplete`, `markSkipped`, `fetchStatistics`, `filterByCategory`, `clearError`
   - Create store:
     - Initialize empty state
     - Implement `fetchHabits`:
       - Set loading true
       - Call `habitService.getAll()`
       - Update habits in state
       - Set loading false
     - Implement `createHabit`:
       - Call `habitService.create()`
       - Add to habits array
     - Implement `updateHabit`:
       - Call `habitService.update()`
       - Update in habits array
     - Implement `deleteHabit`:
       - Call `habitService.delete()`
       - Remove from habits array
     - Implement `markComplete`:
       - Call `completionService.create()`
       - Add to completions record
     - Implement `markSkipped`:
       - Call `skipService.create()`
       - Add to skips record
     - Implement `fetchStatistics`:
       - Call `statisticsService.getHabitStatistics()`
       - Update statistics record
     - Implement `filterByCategory`:
       - Return filtered habits array
   - Export `useHabitStore` hook

---

## Phase 13: Frontend Implementation - Common Components

### Task 13.1: Create Button Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/common/Button.tsx`:
   - Define `ButtonProps` interface:
     - `children: React.ReactNode`
     - `onClick?: () => void`
     - `type?: 'button' | 'submit' | 'reset'`
     - `variant?: 'primary' | 'secondary' | 'danger'`
     - `disabled?: boolean`
     - `className?: string`
   - Create functional component:
     - Apply Tailwind classes based on variant
     - Handle disabled state
     - Return `<button>` element with props
   - Export component

### Task 13.2: Create Input Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/common/Input.tsx`:
   - Define `InputProps` interface extending HTML input props
   - Create functional component:
     - Apply Tailwind styling
     - Forward all props to `<input>` element
   - Export component

### Task 13.3: Create Modal Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/common/Modal.tsx`:
   - Use Headless UI Dialog or create custom modal
   - Define `ModalProps` interface:
     - `isOpen: boolean`
     - `onClose: () => void`
     - `title?: string`
     - `children: React.ReactNode`
   - Create functional component:
     - Render backdrop
     - Render modal container
     - Render title if provided
     - Render children
     - Handle close on backdrop click
     - Apply Tailwind styling
   - Export component

### Task 13.4: Create Loading Spinner Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/common/LoadingSpinner.tsx`:
   - Create functional component:
     - Render animated spinner using Tailwind or CSS
     - Accept optional `size` prop
     - Apply appropriate styling
   - Export component

---

## Phase 14: Frontend Implementation - Auth Components

### Task 14.1: Create Login Form Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/auth/LoginForm.tsx`:
   - Import `useState` from React
   - Import `useAuthStore` from store
   - Import `Button`, `Input` components
   - Create component:
     - State: `email`, `password`, `error`
     - Handle form submit:
       - Prevent default
       - Call `login` from store
       - Handle errors
     - Render form:
       - Email input
       - Password input
       - Submit button
       - Error message if error exists
     - Apply Tailwind styling
   - Export component

### Task 14.2: Create Register Form Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/auth/RegisterForm.tsx`:
   - Similar structure to LoginForm
   - Add `name` field (optional)
   - Call `register` from store
   - Export component

### Task 14.3: Create Protected Route Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/auth/ProtectedRoute.tsx`:
   - Import `Navigate` from react-router-dom
   - Import `useAuthStore` from store
   - Define `ProtectedRouteProps`:
     - `children: React.ReactNode`
   - Create component:
     - Check `isAuthenticated` from store
     - If not authenticated, redirect to `/login`
     - If authenticated, render children
   - Export component

---

## Phase 15: Frontend Implementation - Habit Components

### Task 15.1: Create Habit Card Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/habits/HabitCard.tsx`:
   - Import `Habit` type
   - Define `HabitCardProps`:
     - `habit: Habit`
     - `onClick?: () => void`
     - `onEdit?: () => void`
     - `onDelete?: () => void`
   - Create component:
     - Display habit name, category, frequency
     - Display completion status for today (if available)
     - Render action buttons (edit, delete)
     - Apply Tailwind styling with card design
   - Export component

### Task 15.2: Create Habit List Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/habits/HabitList.tsx`:
   - Import `useHabitStore` from store
   - Import `HabitCard` component
   - Import `useEffect` from React
   - Create component:
     - Get habits from store
     - Call `fetchHabits` on mount
     - Filter by category if needed
     - Render list of `HabitCard` components
     - Show loading state
     - Show empty state if no habits
   - Export component

### Task 15.3: Create Habit Form Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/habits/HabitForm.tsx`:
   - Import `useState`, `FormEvent` from React
   - Import `HabitCategory`, `HabitFrequency`, `CreateHabitDto` types
   - Import `useHabitStore` from store
   - Import form components
   - Define `HabitFormProps`:
     - `habitId?: string` (for edit mode)
     - `onClose: () => void`
   - Create component:
     - Initialize form state with habit data if editing
     - Handle form submission:
       - Validate form data
       - Call `createHabit` or `updateHabit` from store
       - Close modal on success
     - Render form fields:
       - Name input (required)
       - Description textarea (optional)
       - Category select (MORNING, EVENING, OTHER)
       - Frequency select (DAILY, WEEKLY)
       - Conditional fields based on frequency:
         - Times per week (if weekly)
         - Times per day (if daily)
       - Reminder time input (time picker)
     - Apply Tailwind styling
   - Export component

### Task 15.4: Create Habit Category Filter Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/habits/HabitCategoryFilter.tsx`:
   - Import `HabitCategory` type
   - Define `HabitCategoryFilterProps`:
     - `selectedCategory: HabitCategory | null`
     - `onCategoryChange: (category: HabitCategory | null) => void`
   - Create component:
     - Render filter buttons/tabs:
       - "All" button (null category)
       - "Morning" button
       - "Evening" button
       - "Other" button
     - Highlight selected category
     - Apply Tailwind styling
   - Export component

### Task 15.5: Create Habit Detail Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/habits/HabitDetail.tsx`:
   - Import `Habit` type
   - Import `HabitCalendar` component (will create later)
   - Import `StatisticsPanel` component (will create later)
   - Define `HabitDetailProps`:
     - `habit: Habit`
   - Create component:
     - Display habit information
     - Render calendar view
     - Render statistics panel
     - Apply Tailwind styling
   - Export component

---

## Phase 16: Frontend Implementation - Calendar Components

### Task 16.1: Create Calendar Day Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/calendar/CalendarDay.tsx`:
   - Import `Date` type
   - Define `CalendarDayProps`:
     - `date: Date`
     - `status: 'completed' | 'skipped' | 'pending'`
     - `onClick: () => void`
     - `isToday?: boolean`
     - `isCurrentMonth?: boolean`
   - Create component:
     - Render day number
     - Apply styling based on status:
       - Completed: green background
       - Skipped: red/gray background
       - Pending: default
     - Highlight today
     - Dim days from other months
     - Apply Tailwind styling
   - Export component

### Task 16.2: Create Habit Calendar Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/calendar/HabitCalendar.tsx`:
   - Import `useState` from React
   - Import `format`, `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `isSameDay`, `addMonths`, `subMonths` from date-fns
   - Import `Habit`, `HabitCompletion`, `HabitSkip` types
   - Import `useHabitStore` from store
   - Import `CalendarDay` component
   - Define `HabitCalendarProps`:
     - `habit: Habit`
   - Create component:
     - State: `currentMonth` (Date)
     - Get completions and skips from store for this habit
     - Calculate month start and end
     - Generate array of days in month
     - Create `getDayStatus` function:
       - Check if date has completion
       - Check if date has skip
       - Return status
     - Handle day click:
       - Toggle between completed/skipped/pending
       - Call store actions
     - Render calendar:
       - Month navigation (prev/next buttons)
       - Weekday headers (Sun-Sat)
       - Grid of `CalendarDay` components
     - Apply Tailwind styling
   - Export component

### Task 16.3: Create Calendar View Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/calendar/CalendarView.tsx`:
   - Import `HabitCalendar` component
   - Import `useHabitStore` from store
   - Create component:
     - Get selected habit from store
     - If no habit selected, show message
     - Render `HabitCalendar` for selected habit
   - Export component

---

## Phase 17: Frontend Implementation - Statistics Components

### Task 17.1: Create Statistics Card Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/statistics/StatisticsCard.tsx`:
   - Define `StatisticsCardProps`:
     - `title: string`
     - `value: string | number`
     - `subtitle?: string`
     - `icon?: React.ReactNode`
   - Create component:
     - Render card with title, value, subtitle
     - Optional icon display
     - Apply Tailwind styling
   - Export component

### Task 17.2: Create Statistics Chart Component
**Subtasks:**
- [ ] 1. Install chart library (optional): `npm install recharts` or `chart.js`
- [ ] 2. Create `frontend/src/components/statistics/StatisticsChart.tsx`:
   - Import chart library
   - Define `StatisticsChartProps`:
     - `data: Array<{ date: string, value: number }>`
     - `type?: 'line' | 'bar'`
   - Create component:
     - Render chart with provided data
     - Apply styling
   - Export component

### Task 17.3: Create Statistics Panel Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/statistics/StatisticsPanel.tsx`:
   - Import `HabitStatistics` type
   - Import `StatisticsCard` component
   - Import `useHabitStore` from store
   - Import `useEffect` from React
   - Define `StatisticsPanelProps`:
     - `habitId: string`
   - Create component:
     - Get statistics from store
     - Call `fetchStatistics` on mount
     - Render statistics cards:
       - Total Completions
       - Total Skips
       - Completion Rate (%)
       - Current Streak
       - Longest Streak
       - Total Time (convert minutes to hours if needed)
     - Show loading state
     - Apply Tailwind styling
   - Export component

---

## Phase 18: Frontend Implementation - Notification Components

### Task 18.1: Create Notification Settings Component
**Subtasks:**
- [ ] 1. Create `frontend/src/components/notifications/NotificationSettings.tsx`:
   - Import `useState`, `useEffect` from React
   - Import `pushNotificationService` from services
   - Import `useHabitStore` from store
   - Create component:
     - State: `permission`, `isSubscribed`, `loading`
     - Check notification permission on mount
     - Check existing subscription
     - Handle subscribe button:
       - Request permission
       - Get VAPID key
       - Subscribe to push
       - Send subscription to backend
     - Handle unsubscribe button:
       - Unsubscribe from push
       - Remove subscription from backend
     - Render:
       - Permission status
       - Subscribe/Unsubscribe button
       - Habit-specific notification toggles (if applicable)
     - Apply Tailwind styling
   - Export component

---

## Phase 19: Frontend Implementation - Pages

### Task 19.1: Create Login Page
**Subtasks:**
- [ ] 1. Create `frontend/src/pages/LoginPage.tsx`:
   - Import `LoginForm` component
   - Import `useNavigate` from react-router-dom
   - Import `useAuthStore` from store
   - Import `useEffect` from React
   - Create component:
     - Check if already authenticated, redirect to dashboard
     - Render page layout:
       - Title/header
       - `LoginForm` component
       - Link to register page
     - Apply Tailwind styling
   - Export component

### Task 19.2: Create Register Page
**Subtasks:**
- [ ] 1. Create `frontend/src/pages/RegisterPage.tsx`:
   - Similar to LoginPage
   - Use `RegisterForm` component
   - Link to login page
   - Export component

### Task 19.3: Create Dashboard Page
**Subtasks:**
- [ ] 1. Create `frontend/src/pages/DashboardPage.tsx`:
   - Import `ProtectedRoute` component
   - Import `HabitList` component
   - Import `HabitCategoryFilter` component
   - Import `HabitForm` component
   - Import `Modal` component
   - Import `useState` from React
   - Import `useHabitStore` from store
   - Create component:
     - State: `showCreateModal`, `selectedCategory`
     - Render:
       - Header with "Create Habit" button
       - `HabitCategoryFilter` component
       - `HabitList` component (filtered by category)
       - Modal with `HabitForm` (when creating)
     - Apply Tailwind styling
   - Export component

### Task 19.4: Create Habit Detail Page
**Subtasks:**
- [ ] 1. Create `frontend/src/pages/HabitDetailPage.tsx`:
   - Import `useParams` from react-router-dom
   - Import `HabitDetail` component
   - Import `useHabitStore` from store
   - Import `useEffect` from React
   - Create component:
     - Get `habitId` from URL params
     - Fetch habit by ID on mount
     - Render `HabitDetail` component
     - Show loading state
     - Show 404 if habit not found
   - Export component

### Task 19.5: Create Settings Page
**Subtasks:**
- [ ] 1. Create `frontend/src/pages/SettingsPage.tsx`:
   - Import `NotificationSettings` component
   - Import `useAuthStore` from store
   - Create component:
     - Render settings sections:
       - User profile section
       - Notification settings section
       - Logout button
     - Apply Tailwind styling
   - Export component

---

## Phase 20: Frontend Implementation - Routing & App Setup

### Task 20.1: Set Up React Router
**Subtasks:**
- [ ] 1. Update `frontend/src/App.tsx`:
   - Import `BrowserRouter`, `Routes`, `Route`, `Navigate` from react-router-dom
   - Import all page components
   - Import `ProtectedRoute` component
   - Import `useAuthStore` from store
   - Create App component:
     - Wrap in `BrowserRouter`
     - Define routes:
       - `/login` → `LoginPage`
       - `/register` → `RegisterPage`
       - `/dashboard` → `ProtectedRoute` → `DashboardPage`
       - `/habits/:id` → `ProtectedRoute` → `HabitDetailPage`
       - `/settings` → `ProtectedRoute` → `SettingsPage`
       - `/` → Redirect to `/dashboard` if authenticated, else `/login`
     - Add navigation component (optional)
   - Export App component

### Task 20.2: Update Main Entry Point
**Subtasks:**
- [ ] 1. Update `frontend/src/main.tsx`:
   - Import React and ReactDOM
   - Import App component
   - Import CSS file (Tailwind)
   - Render App to root element
   - Check authentication on mount (optional)

---

## Phase 21: PWA Implementation

### Task 21.1: Create Web App Manifest
**Subtasks:**
- [ ] 1. Create `frontend/public/manifest.json`:
   - Add `name`: "Habits Tracker"
   - Add `short_name`: "Habits"
   - Add `description`: "Track your daily habits"
   - Add `start_url`: "/"
   - Add `display`: "standalone"
   - Add `background_color`: "#ffffff"
   - Add `theme_color`: "#3b82f6"
   - Add `orientation`: "portrait"
   - Add `icons` array:
     - Icon 192x192 (create placeholder or actual icon)
     - Icon 512x512 (create placeholder or actual icon)
     - Set `type: "image/png"`
     - Set `purpose: "any maskable"`
- [ ] 2. Link manifest in `frontend/index.html`:
   - Add `<link rel="manifest" href="/manifest.json">`
   - Add theme color meta tag

### Task 21.2: Create Service Worker
**Subtasks:**
- [ ] 1. Create `frontend/public/sw.js`:
   - Define cache name (e.g., 'habits-v1')
   - Add install event listener:
     - Open cache
     - Cache essential files (/, /index.html, CSS, JS)
   - Add fetch event listener:
     - Try cache first, fallback to network
     - Return cached response or fetch
   - Add push event listener:
     - Parse notification data
     - Show notification with title, body, icon
   - Add notificationclick event listener:
     - Close notification
     - Open app window to relevant habit
- [ ] 2. Register service worker in `frontend/src/main.tsx` or separate file:
   - Check if service workers are supported
   - Register service worker
   - Handle updates

### Task 21.3: Create PWA Icons
**Subtasks:**
- [ ] 1. Create icon files in `frontend/public/icons/`:
   - `icon-192x192.png` (192x192 pixels)
   - `icon-512x512.png` (512x512 pixels)
   - Use placeholder images or design actual icons
   - Ensure icons are properly formatted

### Task 21.4: Configure Vite for PWA
**Subtasks:**
- [ ] 1. Install PWA plugin (optional): `npm install vite-plugin-pwa --save-dev`
- [ ] 2. Update `frontend/vite.config.ts`:
   - Import PWA plugin
   - Configure plugin with manifest and service worker options
   - Or manually configure service worker registration

---

## Phase 22: Push Notifications Implementation

### Task 22.1: Implement Push Notification Subscription in Frontend
**Subtasks:**
- [ ] 1. Update `frontend/src/services/pushNotificationService.ts`:
   - Ensure all functions are implemented (from Phase 11.7)
- [ ] 2. Create hook `frontend/src/hooks/useNotifications.ts`:
   - Import `useState`, `useEffect` from React
   - Import `pushNotificationService` from services
   - Create hook:
     - State: `permission`, `subscription`, `loading`
     - Check permission on mount
     - Check existing subscription
     - Provide `subscribe` and `unsubscribe` functions
     - Return state and functions
   - Export hook

### Task 22.2: Integrate Push Notifications in Components
**Subtasks:**
- [ ] 1. Update `NotificationSettings` component:
   - Use `useNotifications` hook
   - Implement subscribe/unsubscribe UI
   - Handle permission requests
- [ ] 2. Update service worker registration:
   - Ensure push event handler is set up
   - Ensure notification click handler is set up

---

## Phase 23: Utility Functions & Helpers

### Task 23.1: Create Date Utilities
**Subtasks:**
- [ ] 1. Create `frontend/src/utils/dateUtils.ts`:
   - Import date-fns functions
   - Create `formatDate(date: Date | string): string` function
   - Create `isToday(date: Date | string): boolean` function
   - Create `isSameDate(date1: Date | string, date2: Date | string): boolean` function
   - Create `getDaysInMonth(year: number, month: number): number` function
   - Export all functions

### Task 23.2: Create Calculation Utilities
**Subtasks:**
- [ ] 1. Create `frontend/src/utils/calculations.ts`:
   - Create `calculateStreak(completions: HabitCompletion[], skips: HabitSkip[]): number` function
   - Create `calculateCompletionRate(completions: number, skips: number): number` function
   - Create `formatDuration(minutes: number): string` function (e.g., "1h 30m")
   - Export all functions

### Task 23.3: Create Validation Utilities
**Subtasks:**
- [ ] 1. Create `frontend/src/utils/validation.ts`:
   - Create email validation function
   - Create password validation function (min length, etc.)
   - Create time format validation (HH:mm)
   - Export all functions

---

## Phase 24: Styling & UI Polish

### Task 24.1: Configure Tailwind Theme
**Subtasks:**
- [ ] 1. Update `frontend/tailwind.config.js`:
   - Define custom colors
   - Define custom spacing if needed
   - Configure responsive breakpoints
   - Add custom utilities if needed

### Task 24.2: Create Global Styles
**Subtasks:**
- [ ] 1. Update `frontend/src/index.css`:
   - Ensure Tailwind directives are present
   - Add custom CSS variables if needed
   - Add global styles (body, etc.)
   - Add utility classes

### Task 24.3: Apply Consistent Styling
**Subtasks:**
- [ ] 1. Review all components:
   - Ensure consistent spacing
   - Ensure consistent colors
   - Ensure responsive design
   - Ensure accessibility (ARIA labels, keyboard navigation)

---

## Phase 25: Error Handling & Loading States

### Task 25.1: Implement Error Boundaries
**Subtasks:**
- [ ] 1. Create `frontend/src/components/common/ErrorBoundary.tsx`:
   - Create class component or use react-error-boundary library
   - Catch React errors
   - Display error UI
   - Export component
- [ ] 2. Wrap App in ErrorBoundary in `main.tsx`

### Task 25.2: Add Loading States
**Subtasks:**
- [ ] 1. Review all components that fetch data:
   - Add loading indicators
   - Use `LoadingSpinner` component
   - Show skeleton screens if preferred

### Task 25.3: Add Error Messages
**Subtasks:**
- [ ] 1. Review all components:
   - Display error messages from store
   - Show user-friendly error messages
   - Handle network errors gracefully

---

## Phase 26: Testing & Validation

### Task 26.1: Test Authentication Flow
**Subtasks:**
- [ ] 1. Test user registration:
   - Valid data
   - Duplicate email
   - Invalid email format
   - Weak password
- [ ] 2. Test user login:
   - Valid credentials
   - Invalid credentials
   - Missing fields
- [ ] 3. Test protected routes:
   - Redirect when not authenticated
   - Allow access when authenticated

### Task 26.2: Test Habit Management
**Subtasks:**
- [ ] 1. Test creating habits:
   - All required fields
   - Optional fields
   - Validation errors
- [ ] 2. Test updating habits:
   - Update individual fields
   - Update all fields
- [ ] 3. Test deleting habits:
   - Confirm deletion
   - Verify habit is removed
- [ ] 4. Test habit list:
   - Display all habits
   - Filter by category
   - Empty state

### Task 26.3: Test Completions & Skips
**Subtasks:**
- [ ] 1. Test marking completions:
   - Mark as complete
   - Add duration and notes
   - Prevent duplicate completions for same date
- [ ] 2. Test marking skips:
   - Mark as skipped
   - Add reason
   - Prevent duplicate skips
- [ ] 3. Test calendar interaction:
   - Click days to toggle status
   - Display correct status colors

### Task 26.4: Test Statistics
**Subtasks:**
- [ ] 1. Test habit statistics:
   - Verify calculations are correct
   - Test streak calculations
   - Test completion rate
- [ ] 2. Test user statistics:
   - Verify totals are correct
   - Test across multiple habits

### Task 26.5: Test Push Notifications
**Subtasks:**
- [ ] 1. Test permission request
- [ ] 2. Test subscription
- [ ] 3. Test receiving notifications (use backend to send test notification)
- [ ] 4. Test notification click behavior

### Task 26.6: Test PWA Features
**Subtasks:**
- [ ] 1. Test offline functionality
- [ ] 2. Test install prompt
- [ ] 3. Test service worker registration
- [ ] 4. Test caching behavior

---

## Phase 27: Environment Configuration & Deployment Prep

### Task 27.1: Finalize Environment Variables
**Subtasks:**
- [ ] 1. Backend `.env`:
   - Set production `DATABASE_URL`
   - Set strong `JWT_SECRET`
   - Set `CORS_ORIGIN` for production domain
   - Set VAPID keys
- [ ] 2. Frontend `.env`:
   - Set production `VITE_API_URL`
- [ ] 3. Create `.env.example` files with placeholders

### Task 27.2: Build for Production
**Subtasks:**
- [ ] 1. Backend:
   - Run `npm run build`
   - Verify `dist/` directory is created
   - Test production build locally
- [ ] 2. Frontend:
   - Run `npm run build`
   - Verify `dist/` directory is created
   - Test production build locally

### Task 27.3: Database Migration for Production
**Subtasks:**
- [ ] 1. Run production migration:
   - `npx prisma migrate deploy` (for production)
   - Or use migration tool provided by hosting service

---

## Phase 28: Documentation & Final Polish

### Task 28.1: Update README
**Subtasks:**
- [ ] 1. Add project description
- [ ] 2. Add setup instructions
- [ ] 3. Add environment variable documentation
- [ ] 4. Add API documentation (or link to it)
- [ ] 5. Add deployment instructions

### Task 28.2: Code Comments
**Subtasks:**
- [ ] 1. Add JSDoc comments to complex functions
- [ ] 2. Add inline comments where logic is non-obvious
- [ ] 3. Ensure type definitions are clear

### Task 28.3: Final Code Review
**Subtasks:**
- [ ] 1. Review all files for:
   - Consistent code style
   - Error handling
   - Type safety
   - Performance optimizations
   - Security considerations

---

## Notes for Implementation

- **Order of Implementation**: Follow phases sequentially, but some tasks can be done in parallel (e.g., frontend and backend can be developed simultaneously after initial setup)
- **Testing**: Test each feature as you build it, don't wait until the end
- **Git**: Commit after completing each major task or phase
- **Error Handling**: Always implement proper error handling from the start
- **Type Safety**: Use TypeScript strictly - avoid `any` types
- **Security**: Never commit `.env` files, always validate inputs, use parameterized queries (Prisma handles this)
- **Performance**: Consider lazy loading for heavy components, optimize database queries
- **Accessibility**: Ensure all interactive elements are keyboard accessible, use semantic HTML

---

This task breakdown provides a comprehensive, step-by-step guide for implementing the entire habit tracking application. Each task is designed to be clear and actionable for Cursor AI to execute.

