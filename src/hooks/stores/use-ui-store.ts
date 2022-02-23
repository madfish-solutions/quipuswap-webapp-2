import { useRootStore } from '@providers/root-store-provider';

export const useUiStore = () => {
  const { uiStore } = useRootStore();

  return uiStore;
};
