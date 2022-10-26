import { isExist } from '@shared/helpers';
import { NoopAsync } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

const getConfirmationMessage = () => {
  return i18n.t('farm|youvesConfirmationUnstake');
};

export const useYouvesUnstakeConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();

  const message = getConfirmationMessage();

  if (isExist(message)) {
    return (yesCallback: NoopAsync) => openConfirmationModal({ message, yesCallback });
  }

  return async (callback: () => NoopAsync) => callback();
};
