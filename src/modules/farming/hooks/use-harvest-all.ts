import { useDoHarvestAll } from './blockchain';

export const useHarvestAll = () => {
  const { doHarvestAll } = useDoHarvestAll();

  const harvestAll = async () => {
    await doHarvestAll();
  };

  return {
    harvestAll
  };
};
