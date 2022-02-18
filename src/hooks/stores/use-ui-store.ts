import { useRootStore } from '@providers/RootStoreProvider';

export const useUiStore = () => {
  const { uiStore } = useRootStore();

  return uiStore;
};
