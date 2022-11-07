import BigNumber from 'bignumber.js';

import { getFullTimelockDescription, isExist } from '@shared/helpers';
import { NoopAsync, Optional, Token } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

export interface ConfirmationMessageParams {
  totalDeposit: Optional<BigNumber>;
  waitingTimeSeconds: BigNumber.Value;
  rewardToken: Token;
  realLostRewardAmount: BigNumber;
}

const getConfirmationMessage = ({
  totalDeposit,
  waitingTimeSeconds,
  rewardToken,
  realLostRewardAmount
}: ConfirmationMessageParams) => {
  if (!isExist(totalDeposit) || totalDeposit.isZero()) {
    return i18n.t('farm|youvesConfirmationNewStake');
  }

  if (realLostRewardAmount.isZero()) {
    return null;
  }

  return i18n.t('farm|youvesConfirmationUpdateStake', {
    waitingTime: getFullTimelockDescription(waitingTimeSeconds, true)
  });
};

export const useYouvesStakeConfirmationPopup = (
  getConfirmationMessageParams: (amountToStake: BigNumber) => ConfirmationMessageParams
) => {
  const { openConfirmationModal } = useConfirmationModal();

  return (yesCallback: NoopAsync, amountToStake: BigNumber) => {
    const message = getConfirmationMessage(getConfirmationMessageParams(amountToStake));

    if (isExist(message)) {
      return openConfirmationModal({ message, yesCallback });
    }

    return yesCallback();
  };
};
