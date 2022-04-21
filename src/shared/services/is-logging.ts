import { IS_LOGGING_KEY } from '@config/localstorage';

export const isLoading = () => {
  try {
    if (window.location.host.includes('quipuswap.com')) {
      return !!localStorage.getItem(IS_LOGGING_KEY);
    }

    return true;
  } catch (_) {
    return false;
  }
};
