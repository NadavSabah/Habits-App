-- DropForeignKey
ALTER TABLE "notification_subscriptions" DROP CONSTRAINT "notification_subscriptions_habitId_fkey";

-- AddForeignKey
ALTER TABLE "notification_subscriptions" ADD CONSTRAINT "notification_subscriptions_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
