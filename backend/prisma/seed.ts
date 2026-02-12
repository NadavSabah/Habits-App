/**
 * Database seed: creates fake users, habits, completions, and skips
 * so the app has full statistics (streaks, completion rate, total time).
 *
 * Run: npm run prisma:seed   (from backend/)
 * Or:  npx prisma db seed    (from backend/)
 *
 * Default test user: demo@example.com / password123
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/utils/bcrypt.util';
import {
  subDays,
  startOfDay,
  addDays,
  format,
  isBefore,
  startOfToday,
} from 'date-fns';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Run from backend/ with .env configured.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = 'password123';
const DAYS_OF_HISTORY = 90;

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await hashPassword(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('User:', user.email);

  const existingHabits = await prisma.habit.findMany({ where: { userId: user.id }, select: { id: true } });
  const habitIds = existingHabits.map((habit) => habit.id);
  if (habitIds.length > 0) {
    await prisma.habitCompletion.deleteMany({ where: { habitId: { in: habitIds } } });
    await prisma.habitSkip.deleteMany({ where: { habitId: { in: habitIds } } });
    await prisma.habit.deleteMany({ where: { userId: user.id } });
    console.log('Cleared existing demo habits and their completions/skips.');
  }

  const habitDefs: { name: string; category: 'MORNING' | 'EVENING' | 'OTHER'; frequency: 'DAILY' | 'WEEKLY'; timesPerWeek?: number; reminderTime?: string }[] = [
    { name: 'Drink water', category: 'MORNING', frequency: 'DAILY', reminderTime: '07:00' },
    { name: 'Morning stretch', category: 'MORNING', frequency: 'DAILY', reminderTime: '07:30' },
    { name: 'Read 10 pages', category: 'EVENING', frequency: 'WEEKLY', timesPerWeek: 5, reminderTime: '21:00' },
    { name: 'Evening run', category: 'OTHER', frequency: 'WEEKLY', timesPerWeek: 3 },
    { name: 'Meditate', category: 'EVENING', frequency: 'DAILY', reminderTime: '20:00' },
  ];

  const today = startOfToday();
  const startDate = startOfDay(subDays(today, DAYS_OF_HISTORY));

  for (const habitDef of habitDefs) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: habitDef.name,
        category: habitDef.category,
        frequency: habitDef.frequency,
        timesPerWeek: habitDef.timesPerWeek ?? null,
        reminderTime: habitDef.reminderTime ?? null,
      },
    });

    console.log('Habit:', habit.name);

    const completionsToCreate: { date: Date; duration: number; notes: string | null }[] = [];
    const skipsToCreate: { date: Date; reason: string | null }[] = [];

    let currentDate = new Date(startDate);
    while (isBefore(currentDate, today) || format(currentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      const dayOfWeek = currentDate.getDay();
      const dayIndex = currentDate.getTime();

      if (habit.frequency === 'WEEKLY' && habit.timesPerWeek != null) {
        const targetPerWeek = habit.timesPerWeek;
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const weekHash = (weekStart.getTime() / (7 * 24 * 60 * 60 * 1000)) | 0;
        const slotInWeek = dayOfWeek * 7 + (dayIndex % 7);
        const doComplete = (weekHash * 31 + slotInWeek) % 7 < targetPerWeek;
        const doSkip = (weekHash * 17 + slotInWeek) % 7 < 2 && !doComplete;
        if (doComplete) {
          completionsToCreate.push({
            date: new Date(currentDate),
            duration: habit.name.includes('run') ? 30 : habit.name.includes('Read') ? 25 : 10,
            notes: null,
          });
        } else if (doSkip) {
          skipsToCreate.push({ date: new Date(currentDate), reason: 'Busy' });
        }
      } else {
        const doComplete = (dayIndex * 13 + habit.id.length) % 5 !== 0;
        const doSkip = !doComplete && (dayIndex * 7) % 3 === 0;
        if (doComplete) {
          completionsToCreate.push({
            date: new Date(currentDate),
            duration: habit.name.includes('stretch') ? 15 : habit.name.includes('Meditate') ? 10 : 5,
            notes: null,
          });
        } else if (doSkip) {
          skipsToCreate.push({ date: new Date(currentDate), reason: null });
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    await prisma.habitCompletion.createMany({
      data: completionsToCreate.map((comp) => ({
        habitId: habit.id,
        date: comp.date,
        duration: comp.duration,
        notes: comp.notes,
      })),
      skipDuplicates: true,
    });

    await prisma.habitSkip.createMany({
      data: skipsToCreate.map((skip) => ({
        habitId: habit.id,
        date: skip.date,
        reason: skip.reason,
      })),
      skipDuplicates: true,
    });

    console.log(`  ${completionsToCreate.length} completions, ${skipsToCreate.length} skips`);
  }

  console.log('Seed complete.');
  console.log('Log in with: demo@example.com / ' + DEMO_PASSWORD);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
