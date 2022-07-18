import { useRootStore } from '@providers/root-store-provider';

export const useTokensManagerStore = () => {
  const { tokensManagerStore } = useRootStore();

  return tokensManagerStore;
};
