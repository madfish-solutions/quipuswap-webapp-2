import { useRootStore } from '@providers/root-store-provider';

export const useSettingsStore = () => {
  const { settingsStore } = useRootStore();

  return settingsStore;
};
