import { MS_IN_SECOND } from '@config/constants';

export function toIntegerSeconds(ms: number): number;
export function toIntegerSeconds(date: Date): number;
export function toIntegerSeconds(data: number | Date) {
  const ms = data instanceof Date ? data.getTime() : data;

  return Math.floor(ms / MS_IN_SECOND);
}

export const getNowTimestampInSeconds = () => toIntegerSeconds(Date.now());
