import { useTranslation } from '@translation';

import { useHarvestAndRollStore } from '../../hooks';

export const useHarvestAndRollModal = () => {
  const { t } = useTranslation(['common', 'farm']);

  const harvestAndRollStore = useHarvestAndRollStore();

  const onClose = () => {
    harvestAndRollStore.close();
  };

  const onNoClick = () => {
    onClose();
  };

  const onYesClick = () => {
    onClose();
  };

  return {
    onClose,
    onNoClick,
    onYesClick,
    texts: {
      harvestOrRoll: t('farm|harvestOrRoll')
    }
  };
};
