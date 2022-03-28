import { useEffect } from 'react';

import { useRootStore } from '../providers/root-store-provider';

export const useFarmingStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.createFarmingListStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingListStore;
};
