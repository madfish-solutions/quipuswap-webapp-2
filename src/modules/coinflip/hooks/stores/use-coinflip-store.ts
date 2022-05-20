import { useRootStore } from '@providers/root-store-provider';

import { CoinflipStore } from '../../stores';

export const useCoinflipStore = () => {
  const { coinflipStore } = useRootStore();

  return coinflipStore as CoinflipStore;
};
