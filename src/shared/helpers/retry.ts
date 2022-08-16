import { sleep } from '@shared/helpers';

const INITIAL_COUNTER_VALUE = 0;
const MS_DEFAULT_RETRY_TIME = 3000;
const DEFAULT_RETRY_TIMES = 6;

export const retry = async <T>(func: () => Promise<T>, times = DEFAULT_RETRY_TIMES): Promise<T> => {
  for (let i = INITIAL_COUNTER_VALUE; i < times; i++) {
    try {
      await sleep(MS_DEFAULT_RETRY_TIME * i);

      return await func();
    } catch (error) {
      if (i === times - 1) {
        return Promise.reject(error);
      }

      continue;
    }
  }

  // this will never happens
  return Promise.reject();
};
