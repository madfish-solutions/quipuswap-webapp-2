import { useRootStore } from '@providers/root-store-provider';

export const useTokensStore = () => {
  const { tokensStore } = useRootStore();

  return tokensStore;
};
