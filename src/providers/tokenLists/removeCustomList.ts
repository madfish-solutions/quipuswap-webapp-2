import { SAVED_LISTS_KEY } from '@utils/defaults';

import { getSavedLists } from './getSavedLists';

export const removeCustomList = (url: string) => {
  const savedList = getSavedLists();
  window.localStorage.setItem(
    SAVED_LISTS_KEY,
    JSON.stringify(
      Object.fromEntries(
        Object.keys(savedList)
          .filter((x) => x !== url)
          .map((x) => [x, savedList[x]]),
      ),
    ),
  );
};
