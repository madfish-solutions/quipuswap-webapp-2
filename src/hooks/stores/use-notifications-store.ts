import { useRootStore } from '@providers/RootStoreProvider';

export const useNotificationsStore = () => {
  const { notificationsStore } = useRootStore();

  return notificationsStore;
};
