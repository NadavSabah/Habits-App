# Prisma Database Guide

This guide explains how to work with Prisma in this project, including common commands and their usage.

## Table of Contents

- [Prisma Commands](#prisma-commands)
- [Common Workflows](#common-workflows)
- [Database Connection](#database-connection)
- [Understanding Migration Files](#understanding-migration-files)
- [Troubleshooting](#troubleshooting)

---

## Prisma Commands

### 1. `npx prisma migrate dev`

**What it does:**
- Creates a new migration file based on changes in your `schema.prisma`
- Applies the migration to your database
- Regenerates Prisma Client with the latest schema

**When to use:**
- After making changes to `schema.prisma`
- During development when you modify your database schema
- Before committing schema changes to version control

**What happens:**
1. Compares your `schema.prisma` file to the current database state
2. If there are differences, prompts you for a migration name
3. Creates a new migration file in `prisma/migrations/` folder
4. Applies the migration to your database
5. Regenerates Prisma Client so your TypeScript code has the latest types

**Example:**
```bash
npx prisma migrate dev --name add_user_avatar
# Creates: prisma/migrations/20251126_add_user_avatar/migration.sql
# Applies it to database
# Updates Prisma Client
```

**Flags:**
- `--name <name>`: Specify the migration name (required)
- `--create-only`: Create migration file without applying it
- `--skip-seed`: Skip running seed scripts

---

### 2. `npx prisma migrate reset`

**What it does:**
- **Drops** your entire database (deletes all data!)
- **Recreates** the database from scratch
- **Applies** all migrations from the beginning
- **Runs** seed scripts (if you have them configured)

**When to use:**
- When you want to start completely fresh (⚠️ deletes all data)
- When your migrations are broken and you want to reset
- During development when you want to test from a clean state
- When you want to test your seed scripts

**⚠️ Warning:** This command **deletes all data** in your database. Use with caution!

**What happens:**
1. Drops all tables and data in your database
2. Recreates the database
3. Runs all migrations in order (from oldest to newest)
4. Runs seed scripts (if you have `prisma/seed.ts` configured)

**Example:**
```bash
npx prisma migrate reset
# ⚠️ All your data is gone!
# Database is now fresh with all migrations applied
```

**Flags:**
- `--force`: Skip confirmation prompt (use with caution!)
- `--skip-seed`: Skip running seed scripts

---

### 3. `npx prisma studio`

**What it does:**
- Opens a **visual web interface** to browse and edit your database
- Runs a local web server (usually on `http://localhost:5555`)
- Provides a user-friendly way to view and manipulate data

**When to use:**
- To visually browse your database tables and data
- To manually add, edit, or delete records for testing
- To debug data issues
- To verify your database structure
- To quickly check if data was saved correctly

**What happens:**
1. Starts a local web server
2. Opens your browser automatically (or navigate to `http://localhost:5555`)
3. Shows all your tables in a visual interface
4. You can click on tables to view/edit data
5. Press `Ctrl+C` in terminal to stop it

**Example:**
```bash
npx prisma studio
# Opens browser at http://localhost:5555
# You see all your tables: users, habits, etc.
# Click on a table to see/edit the data
```

---

## Other Useful Prisma Commands

### `npx prisma generate`

**What it does:**
- Generates Prisma Client based on your `schema.prisma`
- Updates TypeScript types for your models

**When to use:**
- After pulling changes that modify `schema.prisma`
- When Prisma Client types are out of sync
- Usually runs automatically with `migrate dev`, but can be run manually

**Example:**
```bash
npx prisma generate
```

---

### `npx prisma migrate status`

**What it does:**
- Shows the status of your migrations
- Tells you if your database is up to date with your schema

**When to use:**
- To check if migrations are applied
- To verify database state

**Example:**
```bash
npx prisma migrate status
# Output: Database schema is up to date!
```

---

### `npx prisma db push`

**What it does:**
- Pushes schema changes directly to database without creating migration files
- Useful for prototyping (not recommended for production)

**When to use:**
- Quick prototyping
- Development when you don't need migration history

**⚠️ Note:** This doesn't create migration files, so use `migrate dev` for production code.

---

## Common Workflows

### Initial Setup

```bash
# 1. Create .env file with DATABASE_URL
# 2. Create database
psql postgres
CREATE DATABASE habits_db;

# 3. Generate Prisma Client
npx prisma generate

# 4. Create and apply initial migration
npx prisma migrate dev --name init
```

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name describe_your_changes

# 3. Verify changes
npx prisma studio
```

### Starting Fresh

```bash
# ⚠️ This deletes all data!
npx prisma migrate reset

# Then apply migrations again
npx prisma migrate dev
```

### Viewing Your Data

```bash
# Open Prisma Studio
npx prisma studio

# Or use psql directly
psql habits_db
\dt          # List all tables
SELECT * FROM users;  # Query data
```

---

## Database Connection

### Connection String Format

Your `DATABASE_URL` in `.env` follows this format:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

**Example:**
```env
DATABASE_URL="postgresql://nadavsabah@localhost:5432/habits_db"
```

### Prisma 7 Configuration

In Prisma 7, the connection URL is configured in `prisma.config.ts`, not in `schema.prisma`:

```typescript
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

The `schema.prisma` file should **not** have a `url` field in the datasource block:

```prisma
datasource db {
  provider = "postgresql"
  // url is NOT here in Prisma 7
}
```

---

## Understanding Migration Files

When you run `npx prisma migrate dev`, Prisma creates SQL migration files in `prisma/migrations/`. Understanding these files helps you see exactly what changes are being made to your database.

### Migration File Structure

A typical migration file contains four main sections:

1. **Creating Enums** (Custom Types)
2. **Creating Tables**
3. **Creating Indexes**
4. **Creating Foreign Keys**

Let's break down each section:

---

### 1. Creating Enums (Custom Types)

**What are Enums?**
Enums are custom data types that restrict a column to specific predefined values.

**Example:**
```sql
CREATE TYPE "HabitCategory" AS ENUM ('MORNING', 'EVENING', 'OTHER');
```

**Explanation:**
- Creates a custom type called `HabitCategory`
- Only allows three values: `'MORNING'`, `'EVENING'`, or `'OTHER'`
- Used in the `habits` table's `category` column
- Prevents invalid data (e.g., can't set category to "AFTERNOON")

**Another Example:**
```sql
CREATE TYPE "HabitFrequency" AS ENUM ('DAILY', 'WEEKLY');
```
- Creates a type for how often a habit should be done
- Only allows `'DAILY'` or `'WEEKLY'`

**Why use Enums?**
- **Data integrity**: Prevents typos and invalid values
- **Performance**: More efficient than text fields
- **Clarity**: Makes valid options explicit

---

### 2. Creating Tables

**What are Tables?**
Tables store your data in rows and columns, like a spreadsheet.

**Example - Users Table:**
```sql
CREATE TABLE "users" (
    "id" TEXT NOT NULL,              -- Unique identifier (required)
    "email" TEXT NOT NULL,           -- User's email (required)
    "password" TEXT NOT NULL,        -- Hashed password (required)
    "name" TEXT,                     -- User's name (optional - no NOT NULL)
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Auto-set to now
    "updatedAt" TIMESTAMP(3) NOT NULL,  -- Will be updated automatically
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")  -- Makes 'id' the primary key
);
```

**Key Components:**
- **Column Definitions**: Each line defines a column with its data type
- **NOT NULL**: Field is required (must have a value)
- **DEFAULT**: Sets a default value if none provided
- **PRIMARY KEY**: Uniquely identifies each row (like a unique ID)

**Example - Habits Table:**
```sql
CREATE TABLE "habits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,          -- Links to users table
    "name" TEXT NOT NULL,
    "description" TEXT,              -- Optional field
    "category" "HabitCategory" NOT NULL,  -- Uses the enum we created
    "frequency" "HabitFrequency" NOT NULL,  -- Uses the enum we created
    "timesPerWeek" INTEGER,          -- Optional integer
    "reminderTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);
```

**What this creates:**
- A table to store habits
- Links to users via `userId`
- Uses the enums for category and frequency
- Has optional fields (description, timesPerWeek, etc.)

---

### 3. Creating Indexes

**What are Indexes?**
Indexes are like a book's index - they help the database find data quickly without scanning every row.

**Types of Indexes:**

#### Unique Indexes (Prevent Duplicates)
```sql
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```
- Ensures each email appears only once
- Prevents duplicate user accounts
- Also speeds up email lookups

```sql
CREATE UNIQUE INDEX "habit_completions_habitId_date_key" 
ON "habit_completions"("habitId", "date");
```
- Prevents marking the same habit complete twice on the same date
- Combination of `habitId` and `date` must be unique

#### Regular Indexes (Speed Up Queries)
```sql
CREATE INDEX "habits_userId_idx" ON "habits"("userId");
```
- Speeds up finding all habits for a specific user
- Without this, database would scan every habit row

```sql
CREATE INDEX "habits_userId_category_idx" ON "habits"("userId", "category");
```
- Speeds up queries filtering by both user and category
- Example: "Get all morning habits for user X"

**Why Indexes Matter:**
- **Performance**: Queries run much faster
- **Scalability**: Important as data grows
- **Uniqueness**: Unique indexes prevent duplicate data

**Trade-off:**
- Indexes use extra storage space
- Slightly slower writes (but much faster reads)

---

### 4. Creating Foreign Keys

**What are Foreign Keys?**
Foreign keys create relationships between tables and ensure data integrity.

**Example:**
```sql
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```

**Breaking it down:**
- **`FOREIGN KEY ("userId")`**: The `userId` column in `habits` table
- **`REFERENCES "users"("id")`**: Must match an `id` in the `users` table
- **`ON DELETE CASCADE`**: If a user is deleted, delete all their habits too
- **`ON UPDATE CASCADE`**: If a user's id changes, update all related habits

**What this means:**
- You can't create a habit without a valid user
- You can't reference a user that doesn't exist
- Deleting a user automatically deletes their habits

**Another Example:**
```sql
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_habitId_fkey" 
FOREIGN KEY ("habitId") REFERENCES "habits"("id") 
ON DELETE CASCADE ON UPDATE CASCADE;
```
- Links completions to habits
- Deleting a habit deletes all its completions

**Different Cascade Options:**
- **`ON DELETE CASCADE`**: Delete related records (e.g., delete habit → delete completions)
- **`ON DELETE SET NULL`**: Set foreign key to NULL (e.g., delete habit → set habitId to NULL in subscriptions)
- **`ON UPDATE CASCADE`**: Update foreign key when referenced key changes

**Why Foreign Keys Matter:**
- **Data Integrity**: Prevents orphaned records (completions without habits)
- **Automatic Cleanup**: Cascade deletes handle cleanup automatically
- **Referential Integrity**: Ensures relationships are always valid

---

### Complete Migration Example

Here's what a typical migration file looks like in order:

```sql
-- 1. Create Enums
CREATE TYPE "HabitCategory" AS ENUM ('MORNING', 'EVENING', 'OTHER');
CREATE TYPE "HabitFrequency" AS ENUM ('DAILY', 'WEEKLY');

-- 2. Create Tables
CREATE TABLE "users" (...);
CREATE TABLE "habits" (...);
CREATE TABLE "habit_completions" (...);

-- 3. Create Indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "habits_userId_idx" ON "habits"("userId");

-- 4. Create Foreign Keys
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
```

---

### Viewing Migration Files

You can view migration files at:
```
backend/prisma/migrations/[timestamp]_[name]/migration.sql
```

**Example:**
```
backend/prisma/migrations/20251126213702_init/migration.sql
```

**To see all migrations:**
```bash
ls -la backend/prisma/migrations/
```

---

### Understanding Migration History

Prisma tracks which migrations have been applied in the `_prisma_migrations` table:

```sql
SELECT migration_name, finished_at FROM _prisma_migrations;
```

This shows:
- Which migrations have been applied
- When they were applied
- Migration status

---

## Quick Reference

| Command | Purpose | Data Loss? | When to Use |
|---------|---------|------------|-------------|
| `migrate dev` | Create & apply new migration | ❌ No | After schema changes |
| `migrate reset` | Reset database completely | ⚠️ **Yes** | Start fresh, fix broken migrations |
| `studio` | Visual database browser | ❌ No* | View/edit data, debugging |
| `generate` | Regenerate Prisma Client | ❌ No | After schema changes |
| `migrate status` | Check migration status | ❌ No | Verify database state |
| `db push` | Push schema without migrations | ❌ No | Quick prototyping |

*Prisma Studio can modify data if you edit records, but doesn't delete data by default.

---

## Troubleshooting

### Prisma Commands Not Working

**Issue:** `Error [ERR_REQUIRE_ESM]` or similar module errors

**Solution:** Update Node.js to version 20 or higher
```bash
nvm install 20
nvm use 20
```

### Migration Conflicts

**Issue:** Migration files are out of sync

**Solution:** 
```bash
# Reset and start fresh (⚠️ deletes data)
npx prisma migrate reset
```

### Database Connection Errors

**Issue:** Can't connect to database

**Solutions:**
1. Check PostgreSQL is running: `brew services list`
2. Verify `DATABASE_URL` in `.env` file
3. Test connection: `psql habits_db`
4. Check database exists: `psql postgres` then `\l`

### Prisma Client Out of Sync

**Issue:** TypeScript errors about missing fields

**Solution:**
```bash
npx prisma generate
```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Studio Guide](https://www.prisma.io/studio)

---

## Project-Specific Notes

- **Database Name:** `habits_db`
- **Prisma Version:** 7.0.1
- **Node.js Version:** 22+ (required for Prisma 7)
- **Database Provider:** PostgreSQL

For more information about the database schema, see `prisma/schema.prisma`.

