import { useRootStore } from '@providers/root-store-provider';

export const useTokensBalancesStore = () => {
  const { tokensBalancesStore } = useRootStore();

  return tokensBalancesStore;
};
