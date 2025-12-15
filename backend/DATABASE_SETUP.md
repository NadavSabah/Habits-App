# Database Connection Setup Guide

## Quick Setup Steps

### 1. Fix Prisma Schema ✅
The `schema.prisma` file has been updated to include the `DATABASE_URL` environment variable.

### 2. Set Up Your PostgreSQL Database

You have two options:

#### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql@15`
   - Or download from: https://www.postgresql.org/download/

2. **Start PostgreSQL**:
   ```bash
   # macOS with Homebrew
   brew services start postgresql@15
   
   # Or manually
   pg_ctl -D /usr/local/var/postgres start
   ```

3. **Create the database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE habits_db;
   
   # Create a user (optional, or use default 'postgres' user)
   CREATE USER habits_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE habits_db TO habits_user;
   
   # Exit
   \q
   ```

#### Option B: Docker (Recommended for Development)

```bash
# Run PostgreSQL in Docker
docker run --name habits-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=habits_db \
  -p 5432:5432 \
  -d postgres:15-alpine

# To stop: docker stop habits-postgres
# To start again: docker start habits-postgres
# To remove: docker rm habits-postgres
```

### 3. Create `.env` File

Create a `.env` file in the `backend` directory with the following content:

```env
# Database Connection
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME

# For local PostgreSQL (default user):
DATABASE_URL="postgresql://postgres:password@localhost:5432/habits_db"

# For Docker (as shown above):
# DATABASE_URL="postgresql://postgres:password@localhost:5432/habits_db"

# For custom user:
# DATABASE_URL="postgresql://habits_user:your_password@localhost:5432/habits_db"

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Push Notifications (VAPID keys - generate these later)
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:your-email@example.com"
```

**Important**: Replace the values in `DATABASE_URL` with your actual:
- **Username**: Usually `postgres` or your custom user
- **Password**: Your PostgreSQL password
- **Host**: Usually `localhost` for local development
- **Port**: Usually `5432` (default PostgreSQL port)
- **Database**: `habits_db` (or whatever you named it)

### 4. Test the Connection

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# If you want to see your data visually
npm run prisma:studio
```

### 5. Verify Connection

The Prisma client in `src/utils/prisma.ts` will automatically connect when your server starts. If there's a connection error, it will be logged to the console.

## Common Connection Issues

### Issue: "Connection refused" or "ECONNREFUSED"
- **Solution**: Make sure PostgreSQL is running
  - Check: `psql postgres` (should connect)
  - Or: `docker ps` (should show your container)

### Issue: "Authentication failed"
- **Solution**: Check your username and password in `DATABASE_URL`
- Try connecting manually: `psql -U postgres -d habits_db`

### Issue: "Database does not exist"
- **Solution**: Create the database first (see Step 2)

### Issue: "Port 5432 already in use"
- **Solution**: Either stop the existing PostgreSQL service or change the port in your connection string

## Connection String Format

The `DATABASE_URL` follows this format:
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]
```

Examples:
- Local: `postgresql://postgres:mypassword@localhost:5432/habits_db`
- Docker: `postgresql://postgres:password@localhost:5432/habits_db`
- Remote: `postgresql://user:pass@example.com:5432/habits_db`

## Next Steps

Once connected:
1. ✅ Run `npm run prisma:generate` to generate Prisma Client
2. ✅ Run `npm run prisma:migrate` to create database tables
3. ✅ Start your server with `npm run dev`
4. ✅ Your app should now be able to read/write to the database!


