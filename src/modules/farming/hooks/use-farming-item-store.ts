import { useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';

export const useFarmingItemStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.createFarmingItemStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingItemStore;
};
