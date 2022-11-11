import { MS_IN_SECOND } from '@config/constants';

export function toIntegerSeconds(ms: number): number;
export function toIntegerSeconds(date: Date): number;
export function toIntegerSeconds(data: number | Date) {
  const ms = data instanceof Date ? data.getTime() : data;

  return Math.floor(ms / MS_IN_SECOND);
}

export const getNowTimestampInSeconds = () => toIntegerSeconds(Date.now());

/**
 * Returns a difference of two dates in milliseconds
 * @param from a start date as Date object or milliseconds count
 * @param to an end date as Date object or milliseconds count
 */
export function calculateTimeDiffInMs(from: number | Date, to: number | Date) {
  const fromMs = from instanceof Date ? from.getTime() : from;
  const toMs = to instanceof Date ? to.getTime() : to;

  return toMs - fromMs;
}

/**
 * Returns a difference of two dates in seconds
 * @param from a start date as Date object or seconds count
 * @param to an end date as Date object or seconds count
 */
export function calculateTimeDiffInSeconds(from: number | Date, to: number | Date) {
  const fromSeconds = from instanceof Date ? toIntegerSeconds(from.getTime()) : from;
  const toSeconds = to instanceof Date ? toIntegerSeconds(to.getTime()) : to;

  return toSeconds - fromSeconds;
}
