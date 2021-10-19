import { SAVED_LISTS_KEY } from '@utils/defaults';

import { getSavedLists } from './getSavedLists';

export const saveCustomList = ({ key, val }: { key: string; val: boolean }) => {
  window.localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify({ ...getSavedLists(), [key]: val }));
};
