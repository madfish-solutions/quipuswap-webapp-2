import { isExist } from '@shared/helpers';
import { NoopAsync } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { useTranslation } from '@translation';

export const useYouvesHarvestConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation();

  return (yesCallback: NoopAsync) => {
    const message = t('farm|youvesConfirmationHarvestMessage');

    //TODO: add logic for checking if there is a message to show
    if (isExist(message)) {
      return openConfirmationModal({ message, yesCallback });
    }

    return yesCallback();
  };
};
