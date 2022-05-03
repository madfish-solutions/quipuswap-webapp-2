import { IS_DEV_KEY } from '@config/localstorage';

import { isProd } from './is-prod';

export const isDev = () => {
  try {
    if (isProd()) {
      return !!localStorage.getItem(IS_DEV_KEY);
    }

    return true;
  } catch (_) {
    return false;
  }
};
