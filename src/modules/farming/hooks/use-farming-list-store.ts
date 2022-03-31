import { useEffect } from 'react';

import { useRootStore } from '@providers/root-store-provider';

export const useFarmingListStore = () => {
  const rootStore = useRootStore();

  useEffect(() => {
    const initializeStores = async () => {
      await rootStore.createFarmingFilterStore();
      await rootStore.createFarmingListStore();
    };
    void initializeStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return rootStore.farmingListStore;
};
