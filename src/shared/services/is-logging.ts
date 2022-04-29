import { IS_LOGGING_KEY } from '@config/localstorage';

import { isProd } from '../helpers/is-prod';

export const isLoading = () => {
  try {
    if (isProd()) {
      return !!localStorage.getItem(IS_LOGGING_KEY);
    }

    return true;
  } catch (_) {
    return false;
  }
};
