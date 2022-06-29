import { useRootStore } from '@providers/root-store-provider';

import { StableDividendsItemStore } from '../../store';

export const useStableDividendsItemStore = () => {
  const { stableDividendsItemStore } = useRootStore();

  return stableDividendsItemStore as StableDividendsItemStore;
};
