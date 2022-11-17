import { MS_IN_SECOND } from '@config/constants';

import { isGreaterThanZero } from './is-greater-then-zero';
import { isLessThanZero } from './is-less-than-zero';

export function toIntegerSeconds(ms: number): number;
export function toIntegerSeconds(date: Date): number;
export function toIntegerSeconds(data: number | Date) {
  const ms = data instanceof Date ? data.getTime() : data;

  return Math.floor(ms / MS_IN_SECOND);
}

export function toMilliseconds(sec: number): number;
export function toMilliseconds(date: Date): number;
export function toMilliseconds(data: number | Date) {
  return data instanceof Date ? data.getTime() : data * MS_IN_SECOND;
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

export function isPast(ms: number): boolean;
export function isPast(date: Date): boolean;
export function isPast(data: number | Date): boolean {
  return isGreaterThanZero(calculateTimeDiffInMs(data, Date.now()));
}

export function isFuture(ms: number): boolean;
export function isFuture(date: Date): boolean;
export function isFuture(data: number | Date): boolean {
  return isLessThanZero(calculateTimeDiffInMs(data, Date.now()));
}
