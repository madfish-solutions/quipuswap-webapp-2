import { useTranslation } from '@translation';

import { useDoHarvestAll, useHarvestAndRollStore } from '../../hooks';

export const useHarvestAndRollModal = () => {
  const { t } = useTranslation(['common', 'farm']);

  const harvestAndRollStore = useHarvestAndRollStore();
  const { doHarvestAll } = useDoHarvestAll();

  const onClose = () => {
    harvestAndRollStore.close();
  };

  const onHarvestAllClick = async () => {
    await doHarvestAll();
    onClose();
  };

  const onFlipClick = async () => {
    onClose();
  };

  return {
    onClose,
    onHarvestAllClick,
    onFlipClick,
    texts: {
      harvestOrRoll: t('farm|harvestOrRoll')
    }
  };
};
