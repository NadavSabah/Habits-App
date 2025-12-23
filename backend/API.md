# Habits API Documentation

This document provides comprehensive documentation for all API endpoints in the Habits application.

## Table of Contents

- [Habits API Documentation](#habits-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Rate Limiting](#rate-limiting)
  - [API Endpoints](#api-endpoints)
    - [Authentication Routes](#authentication-routes)
      - [POST `/api/auth/register`](#post-apiauthregister)
      - [POST `/api/auth/login`](#post-apiauthlogin)
      - [GET `/api/auth/me`](#get-apiauthme)
    - [Habit Routes](#habit-routes)
      - [GET `/api/habits`](#get-apihabits)
      - [GET `/api/habits/:id`](#get-apihabitsid)
      - [POST `/api/habits`](#post-apihabits)
      - [PUT `/api/habits/:id`](#put-apihabitsid)
      - [DELETE `/api/habits/:id`](#delete-apihabitsid)
    - [Completion Routes](#completion-routes)
      - [POST `/api/habits/:habitId/completions`](#post-apihabitshabitidcompletions)
      - [GET `/api/habits/:habitId/completions`](#get-apihabitshabitidcompletions)
      - [DELETE `/api/habits/completions/:id`](#delete-apihabitscompletionsid)
    - [Skip Routes](#skip-routes)
      - [POST `/api/habits/:habitId/skips`](#post-apihabitshabitidskips)
      - [GET `/api/habits/:habitId/skips`](#get-apihabitshabitidskips)
      - [DELETE `/api/habits/skips/:id`](#delete-apihabitsskipsid)
    - [Statistics Routes](#statistics-routes)
      - [GET `/api/habits/:habitId/statistics`](#get-apihabitshabitidstatistics)
      - [GET `/api/statistics`](#get-apistatistics)
    - [Notification Routes](#notification-routes)
      - [GET `/api/notifications/vapid-key`](#get-apinotificationsvapid-key)
      - [POST `/api/notifications/subscribe`](#post-apinotificationssubscribe)
      - [POST `/api/notifications/unsubscribe`](#post-apinotificationsunsubscribe)
  - [Error Responses](#error-responses)
    - [400 Bad Request](#400-bad-request)
    - [401 Unauthorized](#401-unauthorized)
    - [403 Forbidden](#403-forbidden)
    - [404 Not Found](#404-not-found)
    - [409 Conflict](#409-conflict)
    - [500 Internal Server Error](#500-internal-server-error)
  - [Data Types](#data-types)
    - [Date Format](#date-format)
    - [Time Format](#time-format)
    - [Category Enum](#category-enum)
    - [Frequency Enum](#frequency-enum)
  - [Notes](#notes)
  - [Example Usage](#example-usage)
    - [Complete Workflow Example](#complete-workflow-example)

---

## Base URL

All API endpoints are prefixed with `/api`.

**Example:** `http://localhost:3000/api`

---

## Authentication

Most endpoints require authentication via JWT (JSON Web Token). Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Rate Limiting

Authentication endpoints (`/api/auth/register` and `/api/auth/login`) are rate-limited to prevent abuse and brute force attacks.

---

## API Endpoints

### Authentication Routes

Base path: `/api/auth`

#### POST `/api/auth/register`

Register a new user account.

**Authentication:** Not required  
**Rate Limited:** Yes

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 characters, max 100 characters)",
  "name": "string (optional, max 100 characters)"
}
```

**Required Fields:**
- `email` - Valid email address
- `password` - Minimum 8 characters, maximum 100 characters

**Optional Fields:**
- `name` - User's name (max 100 characters)

**Response:** 201 Created
```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  }
}
```

---

#### POST `/api/auth/login`

Login with email and password.

**Authentication:** Not required  
**Rate Limited:** Yes

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Required Fields:**
- `email` - Valid email address
- `password` - Password (must not be empty)

**Response:** 200 OK
```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  }
}
```

---

#### GET `/api/auth/me`

Get the current authenticated user's information.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "id": "string",
  "email": "string",
  "name": "string | null"
}
```

---

### Habit Routes

Base path: `/api/habits`

All habit routes require authentication. Users can only access their own habits.

#### GET `/api/habits`

Get all habits for the authenticated user.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Response:** 200 OK
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string | null",
    "category": "MORNING | EVENING | OTHER",
    "frequency": "DAILY | WEEKLY",
    "timesPerWeek": "number | null",
    "timesPerDay": "number | null",
    "timesPerMonth": "number | null",
    "reminderTime": "string | null",
    "userId": "string",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
]
```

---

#### GET `/api/habits/:id`

Get a specific habit by ID.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id` - Habit ID (required)

**Response:** 200 OK
```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "category": "MORNING | EVENING | OTHER",
  "frequency": "DAILY | WEEKLY",
  "timesPerWeek": "number | null",
  "timesPerDay": "number | null",
  "timesPerMonth": "number | null",
  "reminderTime": "string | null",
  "userId": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

---

#### POST `/api/habits`

Create a new habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (required, min 1, max 100 characters)",
  "description": "string (optional, max 500 characters)",
  "category": "MORNING | EVENING | OTHER (required)",
  "frequency": "DAILY | WEEKLY (required)",
  "timesPerWeek": "number (optional, integer, min 1, max 7)",
  "timesPerDay": "number (optional, integer, min 1, max 24)",
  "timesPerMonth": "number (optional, integer, min 1, max 31)",
  "reminderTime": "string (optional, HH:mm format, e.g., '09:30')"
}
```

**Required Fields:**
- `name` - Habit name (1-100 characters)
- `category` - One of: `MORNING`, `EVENING`, `OTHER`
- `frequency` - One of: `DAILY`, `WEEKLY`

**Optional Fields:**
- `description` - Habit description (max 500 characters)
- `timesPerWeek` - Integer between 1-7 (for weekly habits)
- `timesPerDay` - Integer between 1-24 (for daily habits)
- `timesPerMonth` - Integer between 1-31 (for monthly habits)
- `reminderTime` - Time in HH:mm format (24-hour format, e.g., "09:30", "21:15")

**Response:** 201 Created
```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "category": "MORNING | EVENING | OTHER",
  "frequency": "DAILY | WEEKLY",
  "timesPerWeek": "number | null",
  "timesPerDay": "number | null",
  "timesPerMonth": "number | null",
  "reminderTime": "string | null",
  "userId": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

---

#### PUT `/api/habits/:id`

Update an existing habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id` - Habit ID (required)

**Request Body:**
All fields are optional. Only include fields you want to update.
```json
{
  "name": "string (optional, min 1, max 100 characters)",
  "description": "string (optional, max 500 characters)",
  "category": "MORNING | EVENING | OTHER (optional)",
  "frequency": "DAILY | WEEKLY (optional)",
  "timesPerWeek": "number (optional, integer, min 1, max 7)",
  "timesPerDay": "number (optional, integer, min 1, max 24)",
  "timesPerMonth": "number (optional, integer, min 1, max 31)",
  "reminderTime": "string (optional, HH:mm format)"
}
```

**Response:** 200 OK
```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "category": "MORNING | EVENING | OTHER",
  "frequency": "DAILY | WEEKLY",
  "timesPerWeek": "number | null",
  "timesPerDay": "number | null",
  "timesPerMonth": "number | null",
  "reminderTime": "string | null",
  "userId": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

---

#### DELETE `/api/habits/:id`

Delete a habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id` - Habit ID (required)

**Response:** 200 OK or 204 No Content

---

### Completion Routes

Base path: `/api/habits`

All completion routes require authentication. Users can only access completions for their own habits.

#### POST `/api/habits/:habitId/completions`

Create a new completion for a habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `habitId` - Habit ID (required)

**Request Body:**
```json
{
  "date": "string (required, YYYY-MM-DD format, e.g., '2024-01-15')",
  "duration": "number (optional, integer, min 1, max 1440 minutes)",
  "notes": "string (optional, max 500 characters)"
}
```

**Required Fields:**
- `date` - Date in YYYY-MM-DD format (e.g., "2024-01-15")

**Optional Fields:**
- `duration` - Duration in minutes (integer, 1-1440, max 24 hours)
- `notes` - Additional notes (max 500 characters)

**Response:** 201 Created
```json
{
  "id": "string",
  "habitId": "string",
  "date": "YYYY-MM-DD",
  "duration": "number | null",
  "notes": "string | null",
  "createdAt": "ISO 8601 date string"
}
```

---

#### GET `/api/habits/:habitId/completions`

Get all completions for a habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `habitId` - Habit ID (required)

**Query Parameters:**
- `startDate` - Optional, filter from date (YYYY-MM-DD format)
- `endDate` - Optional, filter to date (YYYY-MM-DD format)

**Example:** `/api/habits/123/completions?startDate=2024-01-01&endDate=2024-01-31`

**Response:** 200 OK
```json
[
  {
    "id": "string",
    "habitId": "string",
    "date": "YYYY-MM-DD",
    "duration": "number | null",
    "notes": "string | null",
    "createdAt": "ISO 8601 date string"
  }
]
```

---

#### DELETE `/api/habits/completions/:id`

Delete a completion.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id` - Completion ID (required)

**Response:** 200 OK or 204 No Content

---

### Skip Routes

Base path: `/api/habits`

All skip routes require authentication. Users can only access skips for their own habits.

#### POST `/api/habits/:habitId/skips`

Create a new skip for a habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `habitId` - Habit ID (required)

**Request Body:**
```json
{
  "date": "string (required, YYYY-MM-DD format, e.g., '2024-01-15')",
  "reason": "string (optional, max 500 characters)"
}
```

**Required Fields:**
- `date` - Date in YYYY-MM-DD format (e.g., "2024-01-15")

**Optional Fields:**
- `reason` - Reason for skipping (max 500 characters)

**Response:** 201 Created
```json
{
  "id": "string",
  "habitId": "string",
  "date": "YYYY-MM-DD",
  "reason": "string | null",
  "createdAt": "ISO 8601 date string"
}
```

---

#### GET `/api/habits/:habitId/skips`

Get all skips for a habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `habitId` - Habit ID (required)

**Query Parameters:**
- `startDate` - Optional, filter from date (YYYY-MM-DD format)
- `endDate` - Optional, filter to date (YYYY-MM-DD format)

**Example:** `/api/habits/123/skips?startDate=2024-01-01&endDate=2024-01-31`

**Response:** 200 OK
```json
[
  {
    "id": "string",
    "habitId": "string",
    "date": "YYYY-MM-DD",
    "reason": "string | null",
    "createdAt": "ISO 8601 date string"
  }
]
```

---

#### DELETE `/api/habits/skips/:id`

Delete a skip.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `id` - Skip ID (required)

**Response:** 200 OK or 204 No Content

---

### Statistics Routes

#### GET `/api/habits/:habitId/statistics`

Get statistics for a specific habit.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**URL Parameters:**
- `habitId` - Habit ID (required)

**Response:** 200 OK
```json
{
  "habitId": "string",
  "totalCompletions": "number",
  "totalSkips": "number",
  "completionRate": "number",
  "currentStreak": "number",
  "longestStreak": "number",
  "averageDuration": "number | null",
  // Additional statistics fields...
}
```

---

#### GET `/api/statistics`

Get overall statistics for the authenticated user.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "totalHabits": "number",
  "totalCompletions": "number",
  "totalSkips": "number",
  "overallCompletionRate": "number",
  // Additional user-level statistics...
}
```

---

### Notification Routes

Base path: `/api/notifications`

All notification routes require authentication.

#### GET `/api/notifications/vapid-key`

Get public VAPID key for client-side push notification subscription.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "publicKey": "string"
}
```

---

#### POST `/api/notifications/subscribe`

Subscribe to push notifications.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "endpoint": "string (required, push subscription endpoint)",
  "keys": {
    "p256dh": "string (required)",
    "auth": "string (required)"
  },
  "habitId": "string (optional, specific habit ID for targeted notifications)"
}
```

**Required Fields:**
- `endpoint` - Push subscription endpoint URL
- `keys.p256dh` - P256DH key
- `keys.auth` - Auth key

**Optional Fields:**
- `habitId` - Specific habit ID for targeted notifications

**Response:** 201 Created or 200 OK (if subscription updated)
```json
{
  "message": "Subscription created successfully" | "Subscription updated successfully"
}
```

---

#### POST `/api/notifications/unsubscribe`

Unsubscribe from push notifications.

**Authentication:** Required

**Request Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "endpoint": "string (required, push subscription endpoint)"
}
```

**Required Fields:**
- `endpoint` - Push subscription endpoint URL

**Response:** 204 No Content

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
Invalid request data or validation errors.
```json
{
  "error": "Bad Request",
  "message": "Validation error message"
}
```

### 401 Unauthorized
Missing or invalid authentication token.
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
User does not have permission to access the resource.
```json
{
  "error": "Forbidden",
  "message": "Access denied"
}
```

### 404 Not Found
Resource not found.
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 Conflict
Resource conflict (e.g., duplicate entry).
```json
{
  "error": "Conflict",
  "message": "Conflict message"
}
```

### 500 Internal Server Error
Server error.
```json
{
  "error": "Server Error",
  "message": "Internal server error message"
}
```

---

## Data Types

### Date Format
All dates should be in `YYYY-MM-DD` format (ISO 8601 date format).

**Example:** `2024-01-15`

### Time Format
Time values should be in `HH:mm` format (24-hour format).

**Examples:**
- `09:30` (9:30 AM)
- `21:15` (9:15 PM)

### Category Enum
- `MORNING` - Morning habits
- `EVENING` - Evening habits
- `OTHER` - Other habits

### Frequency Enum
- `DAILY` - Daily habits
- `WEEKLY` - Weekly habits

---

## Notes

1. **Authentication:** Most endpoints require a valid JWT token in the `Authorization` header. The token is obtained from the `/api/auth/login` or `/api/auth/register` endpoints.

2. **User Isolation:** Users can only access their own habits, completions, and skips. Attempting to access another user's resources will result in a 404 or 403 error.

3. **Date Filtering:** When using query parameters for date filtering (`startDate`, `endDate`), both dates are inclusive.

4. **Validation:** All request bodies are validated using Zod schemas. Invalid data will return a 400 Bad Request response with detailed error messages.

5. **Rate Limiting:** Authentication endpoints are rate-limited to prevent abuse. If you exceed the rate limit, you'll receive a 429 Too Many Requests response.

---

## Example Usage

### Complete Workflow Example

1. **Register a new user:**
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

2. **Create a habit:**
```bash
POST /api/habits
Authorization: Bearer <token>
{
  "name": "Morning Meditation",
  "description": "10 minutes of meditation",
  "category": "MORNING",
  "frequency": "DAILY",
  "reminderTime": "07:00"
}
```

3. **Mark a completion:**
```bash
POST /api/habits/{habitId}/completions
Authorization: Bearer <token>
{
  "date": "2024-01-15",
  "duration": 10,
  "notes": "Felt great today!"
}
```

4. **Get habit statistics:**
```bash
GET /api/habits/{habitId}/statistics
Authorization: Bearer <token>
```

---

*Last updated: Based on current codebase structure*

