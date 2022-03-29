import { useRootStore } from '@providers';

export const useAuthStore = () => {
  const { authStore } = useRootStore();

  return authStore;
};
