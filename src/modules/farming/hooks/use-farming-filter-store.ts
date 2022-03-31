import { useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';

export const useFarmingFilterStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    rootStore.createFarmingFilterStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingFilterStore;
};
