/**
 * Cron Service
 * 
 * Handles scheduled tasks using node-cron.
 * Currently schedules reminder notifications to be checked every minute.
 */

import * as cron from 'node-cron';
import { pushNotificationService } from './push-notification.service';
import { createLogger } from '../utils/logger.util';

const logger = createLogger('CronService');

/**
 * Start all cron jobs
 * Schedules jobs to run at specified intervals
 */
export const startCronJobs = (): void => {
  // Schedule job to run every minute to check and send reminders
  // Cron pattern: '* * * * *' means every minute
  cron.schedule('* * * * *', async () => {
    try {
      logger.debug('Running reminder check cron job');
      await pushNotificationService.checkAndSendReminders();
    } catch (error) {
      logger.error('Error in reminder check cron job', error);
    }
  });

  logger.info('Cron jobs started successfully');
};
