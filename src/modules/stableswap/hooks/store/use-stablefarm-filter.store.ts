import { useRootStore } from '@providers/root-store-provider';

import { StableDividendsFilterStore } from '../../store';

export const useStableDividendsFilterStore = () => {
  const { stableDividendsFilterStore } = useRootStore();

  return stableDividendsFilterStore as StableDividendsFilterStore;
};
