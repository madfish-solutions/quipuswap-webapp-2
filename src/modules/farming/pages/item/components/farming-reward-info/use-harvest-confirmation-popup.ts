import { useConfirmationModal } from '@shared/utils';
import { useTranslation } from '@translation';

export const useHarvestConfirmationPopup = () => {
  const { openConfirmationModal } = useConfirmationModal();
  const { t } = useTranslation('farm');

  const title = t('farm|Wanna earn more?');
  const confirmationMessage = t('farm|increaseYourIncome');
  const yesButtonText = t('farm|iAmIn');
  const noButtonText = t('farm|Nope');

  return (yesCallback: () => Promise<void>, noCallback?: () => Promise<void>) =>
    openConfirmationModal({
      title,
      message: confirmationMessage,
      yesButtonText,
      noButtonText,
      yesCallback,
      noCallback
    });
};
