/**
 * Push Notification Service
 * 
 * Handles sending push notifications for habit reminders.
 */

import * as webpush from 'web-push';
import { prisma } from '../utils/prisma';
import { format, startOfToday, startOfTomorrow } from 'date-fns';

// Configure VAPID details from environment variables
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
  console.warn('VAPID keys not configured. Push notifications will not work.');
} else {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

/**
 * Send habit reminder notification to all subscriptions for a habit
 * @param habitId - Habit's unique identifier
 * @param message - Message to send in the notification
 */
export const sendHabitReminder = async (
  habitId: string,
  message: string
): Promise<void> => {
  // Find all subscriptions for this habit
  const subscriptions = await prisma.notificationSubscription.findMany({
    where: {
      habitId,
    },
  });

  if (subscriptions.length === 0) {
    return; // No subscriptions to send to
  }

  // Create payload JSON
  const payload = JSON.stringify({
    title: 'Habit Reminder',
    body: message,
    habitId,
  });

  // Loop through subscriptions and send notifications
  for (const subscription of subscriptions) {
    try {
      // Parse the keys from JSON
      const keys = subscription.keys as { p256dh: string; auth: string };

      // Create subscription object for webpush
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      };

      // Send notification
      await webpush.sendNotification(pushSubscription, payload);
    } catch (error: any) {
      // If error status is 410 (Gone), the subscription has expired
      if (error.statusCode === 410) {
        // Delete expired subscription
        await prisma.notificationSubscription.delete({
          where: {
            id: subscription.id,
          },
        });
        console.log(`Deleted expired subscription: ${subscription.id}`);
      } else {
        // Log other errors but don't throw
        console.error(
          `Error sending notification to subscription ${subscription.id}:`,
          error
        );
      }
    }
  }
};

/**
 * Check and send reminders for habits that match the current time
 * Finds habits with reminderTime matching current time and sends notifications
 * if the habit hasn't been completed today
 */
export const checkAndSendReminders = async (): Promise<void> => {
  // Get current time in HH:mm format
  const currentTime = format(new Date(), 'HH:mm');

  // Find habits with matching reminderTime and subscriptions
  const habits = await prisma.habit.findMany({
    where: {
      reminderTime: currentTime,
      subscriptions: {
        some: {}, // Has at least one subscription
      },
    },
    include: {
      subscriptions: true,
      completions: {
        where: {
          date: {
            gte: startOfToday(),
            lt: startOfTomorrow(),
          },
        },
      },
    },
  });

  // For each habit, check if already completed today
  for (const habit of habits) {
    // If not completed today, send reminder
    if (habit.completions.length === 0) {
      const message = `Don't forget to complete "${habit.name}"!`;
      await sendHabitReminder(habit.id, message);
    }
  }
};

/**
 * Create or update a notification subscription
 * @param userId - User's unique identifier
 * @param endpoint - Push subscription endpoint
 * @param keys - Push subscription keys (p256dh and auth)
 * @param habitId - Optional habit ID to subscribe to
 * @returns Object with success status and message
 * @throws Error if subscription belongs to different user
 */
export const createOrUpdateSubscription = async (
  userId: string,
  endpoint: string,
  keys: { p256dh: string; auth: string },
  habitId?: string | null
): Promise<{ isUpdate: boolean }> => {
  // Check if subscription already exists for this endpoint
  const existingSubscription = await prisma.notificationSubscription.findUnique({
    where: {
      endpoint,
    },
  });

  if (existingSubscription) {
    // Verify subscription belongs to the same user
    if (existingSubscription.userId !== userId) {
      throw new Error('Endpoint already subscribed by another user');
    }

    // Update existing subscription
    await prisma.notificationSubscription.update({
      where: {
        endpoint,
      },
      data: {
        keys: keys as any,
        habitId: habitId || null,
      },
    });

    return { isUpdate: true };
  }

  // Create new notification subscription
  await prisma.notificationSubscription.create({
    data: {
      userId,
      habitId: habitId || null,
      endpoint,
      keys: keys as any,
    },
  });

  return { isUpdate: false };
};

/**
 * Delete a notification subscription
 * @param userId - User's unique identifier
 * @param endpoint - Push subscription endpoint
 * @returns true if subscription was deleted, false if not found
 * @throws Error if subscription doesn't belong to user
 */
export const deleteSubscription = async (
  userId: string,
  endpoint: string
): Promise<boolean> => {
  // Find subscription by endpoint
  const subscription = await prisma.notificationSubscription.findUnique({
    where: {
      endpoint,
    },
  });

  if (!subscription) {
    return false;
  }

  // Verify subscription belongs to user
  if (subscription.userId !== userId) {
    throw new Error('Subscription does not belong to user');
  }

  // Delete subscription
  await prisma.notificationSubscription.delete({
    where: {
      endpoint,
    },
  });

  return true;
};

// Export service object
export const pushNotificationService = {
  sendHabitReminder,
  checkAndSendReminders,
  createOrUpdateSubscription,
  deleteSubscription,
};

