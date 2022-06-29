import { useRootStore } from '@providers/root-store-provider';

import { StableDividendsListStore } from '../../store';

export const useStableDividendsListStore = () => {
  const { stableDividendsListStore } = useRootStore();

  return stableDividendsListStore as StableDividendsListStore;
};
