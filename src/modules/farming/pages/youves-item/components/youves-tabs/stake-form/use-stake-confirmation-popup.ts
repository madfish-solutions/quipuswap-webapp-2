import BigNumber from 'bignumber.js';

import { isExist } from '@shared/helpers';
import { Optional } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

const getConfirmationMessage = (depositBalance: Optional<BigNumber>) => {
  if (!isExist(depositBalance) || depositBalance.isZero()) {
    return null;
  }

  // TODO: add logic bound with due date
  return i18n.t('farm|youvesConfirmationUpdateStake');
};

export const useYouvesStakeConfirmationPopup = (totalDeposit: Optional<BigNumber>) => {
  const { openConfirmationModal } = useConfirmationModal();

  const message = getConfirmationMessage(totalDeposit);

  if (isExist(message)) {
    return (yesCallback: () => Promise<void>) => openConfirmationModal({ message, yesCallback });
  }

  return async (callback: () => Promise<void>) => callback();
};
