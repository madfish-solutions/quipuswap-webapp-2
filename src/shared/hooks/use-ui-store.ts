import { useRootStore } from '@providers';

export const useUiStore = () => {
  const { uiStore } = useRootStore();

  return uiStore;
};
