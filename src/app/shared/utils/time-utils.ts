import { addMinutes, format } from 'date-fns';

export const SECONDS_IN_WEEK = 24 * 60 * 60 * 7;
export const SECONDS_IN_DAY = 24 * 60 * 60;

export function getStartEpochOfWeek(timestamp: number): number {
  const epochDay = getDayOfWeek(timestamp) - 1;
  const mondayTimestamp = timestamp - epochDay * SECONDS_IN_DAY;
  return mondayTimestamp - (mondayTimestamp % SECONDS_IN_DAY);
}

export function currentEpochDay(): number {
  return getEpochDay(Math.floor(timestampNow() / 1000));
}

export function getEpochDay(timestamp: number): number {
  return Math.floor(timestamp / SECONDS_IN_DAY);
}

export function getEpochWeek(timestamp: number): number {
  return Math.floor((getEpochDay(timestamp) + 3) / 7);
}

export function getCurrentWeek(): number {
  return getEpochWeek(Math.floor(timestampNow() / 1000));
}

export function getDayOfWeek(timestamp: number): number {
  const value = Math.floor((timestamp / SECONDS_IN_DAY + 4) % 7);
  return value === 0 ? 7 : value;
}

export function getDays(timestamp: number): number {
  return Math.floor(timestamp / (24 * 60 * 60)) % 24;
}

export function getHours(timestamp: number): number {
  return Math.floor(timestamp / (60 * 60)) % 24;
}

export function getMinutes(timestamp: number): number {
  return Math.floor(timestamp / 60) % 60;
}

export function getSeconds(timestamp: number): number {
  return timestamp % 60;
}

export function getDateInUTC(date: Date | undefined = undefined): Date {
  if (!date) {
    date = new Date();
  }
  return addMinutes(date, date.getTimezoneOffset());
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function timestampToFormattedDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toUTCString();
}

export function timestampNow(): number {
  return new Date().getTime();
}

export function timestampNowInSeconds(): number {
  return Math.floor(timestampNow() / 1000);
}

export function formatDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return format(date, 'dd/MM/yyyy');
}