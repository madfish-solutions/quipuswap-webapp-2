import { useEffect } from 'react';

import { useRootStore } from '@providers';

export const useFarmingItemStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.createFarmingItemStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingItemStore;
};
