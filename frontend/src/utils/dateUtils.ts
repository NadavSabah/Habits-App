import {
  format,
  getDaysInMonth as getDaysInMonthFromDate,
  isSameDay,
  isToday as isTodayFromDate,
  parseISO,
} from 'date-fns';
import type { DateInput } from '../types';

function toDate(date: DateInput): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

/**
 * Format a date as yyyy-MM-dd (matches API / habit completion date strings).
 */
export function formatDate(date: DateInput): string {
  return format(toDate(date), 'yyyy-MM-dd');
}

/**
 * Returns true if the given date is today (local timezone).
 */
export function isToday(date: DateInput): boolean {
  return isTodayFromDate(toDate(date));
}

/**
 * Returns true if two dates fall on the same calendar day (local timezone).
 */
export function isSameDate(date1: DateInput, date2: DateInput): boolean {
  return isSameDay(toDate(date1), toDate(date2));
}

/**
 * Number of days in a calendar month.
 * @param year - Full year (e.g. 2026)
 * @param month - Month 1–12 (January = 1)
 */
export function getDaysInMonth(year: number, month: number): number {
  return getDaysInMonthFromDate(new Date(year, month - 1, 1));
}
