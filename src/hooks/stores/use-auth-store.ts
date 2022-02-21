import { useRootStore } from '@providers/RootStoreProvider';

export const useAuthStore = () => {
  const { authStore } = useRootStore();

  return authStore;
};
