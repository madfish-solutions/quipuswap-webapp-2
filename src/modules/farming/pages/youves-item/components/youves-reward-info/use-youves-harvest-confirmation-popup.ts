import { NoopAsync } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { useTranslation } from '@translation';

export const useYouvesHarvestConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation();

  return async (yesCallback: NoopAsync, rewardsDueDate: number) => {
    if (rewardsDueDate > Date.now()) {
      const message = t('farm|youvesConfirmationHarvestMessage');

      return openConfirmationModal({ message, yesCallback });
    }

    return yesCallback();
  };
};
