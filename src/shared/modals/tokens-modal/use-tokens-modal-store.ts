import { useRootStore } from '@providers/root-store-provider';

export const useTokensModalStore = () => {
  const { tokensModalStore } = useRootStore();

  return tokensModalStore;
};
