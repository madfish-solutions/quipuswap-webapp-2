import { SAVED_LISTS_KEY } from '@utils/defaults';
import { isClient } from '@utils/helpers';

export const getSavedLists = () =>
  isClient ? JSON.parse(window.localStorage.getItem(SAVED_LISTS_KEY) || '{}') : [];
