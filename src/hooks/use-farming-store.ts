import { useEffect } from 'react';

import { useRootStore } from '../providers/root-store-provider';

export const useFarmingStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.createFarmingStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingStore;
};
