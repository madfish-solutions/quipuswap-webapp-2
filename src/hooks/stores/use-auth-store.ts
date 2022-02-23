import { useRootStore } from '@providers/root-store-provider';

export const useAuthStore = () => {
  const { authStore } = useRootStore();

  return authStore;
};
