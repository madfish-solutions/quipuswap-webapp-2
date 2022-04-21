import { IS_LOGGING_KEY } from '@config/localstorage';

export const isLoading = () => {
  try {
    return !!localStorage.getItem(IS_LOGGING_KEY);
  } catch (_) {
    return false;
  }
};
