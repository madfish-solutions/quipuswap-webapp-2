import { FormEvent, useCallback } from 'react';

import { isNull } from '@shared/helpers';
import { BaseFilterStore } from '@shared/store';

import { useAmplitudeService } from './use-amplitude-service';

export const useBaseFilterStoreConverter = (store: BaseFilterStore) => {
  const { search, tokenIdValue, sortDirection } = store;
  const { log } = useAmplitudeService();

  const handleSortDirectionToggle = useCallback(() => {
    store.onSortDirectionToggle();
    log('SORT_DIRECTION_CHANGED', { direction: store.sortDirection });
  }, [store, log]);

  const onSearchChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      if (isNull(event)) {
        return;
      }
      store.onSearchChange((event.target as HTMLInputElement).value);
    },
    [store]
  );

  const onTokenIdChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      if (isNull(event) || isNull(event.target)) {
        return;
      }
      store.onTokenIdChange((event.target as HTMLInputElement).value);
    },
    [store]
  );

  const handleIncrement = useCallback(() => {
    store.handleIncrement();
  }, [store]);

  const handleDecrement = useCallback(() => {
    store.handleDecrement();
  }, [store]);

  return {
    search,
    tokenIdValue,
    sortDirection,

    onSearchChange,
    onTokenIdChange,

    handleIncrement,
    handleDecrement,

    handleSortDirectionToggle
  };
};
