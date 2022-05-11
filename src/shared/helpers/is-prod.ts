import { IS_DEV_KEY, IS_PROD_KEY } from '@config/localstorage';

import { isProdDomain } from './is-prod-domain';

export const isProd = () => {
  try {
    if (isProdDomain()) {
      return !localStorage.getItem(IS_DEV_KEY);
    }

    return !!localStorage.getItem(IS_PROD_KEY);
  } catch (_) {
    return false;
  }
};

export const isDev = () => !isProd();
