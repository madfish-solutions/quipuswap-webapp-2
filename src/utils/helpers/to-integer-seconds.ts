import { MS_IN_SECOND } from '@app.config';

export const toIntegerSeconds = (timestamp: Date | number) => {
  const msTimestamp = typeof timestamp === 'number' ? timestamp : timestamp.getTime();

  return Math.floor(msTimestamp / MS_IN_SECOND);
};
