import { useEffect, useState } from 'react';

import { useRootStore } from '@providers/root-store-provider';

export const useFarmingPageViewModel = () => {
  const [isInitialazied, setIsInitialazied] = useState(false);
  const rootStore = useRootStore();

  useEffect(() => {
    (async () => {
      try {
        await rootStore.createFarmingFilterStore();
        await rootStore.createFarmingListStore();
        await rootStore.createFarmingItemStore();
      } finally {
        setIsInitialazied(true);
      }
    })();
  }, [rootStore]);

  return { isInitialazied };
};
