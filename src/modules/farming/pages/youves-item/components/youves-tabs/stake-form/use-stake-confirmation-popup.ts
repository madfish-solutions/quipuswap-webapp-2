import BigNumber from 'bignumber.js';

import { formatValueBalance, getFullTimelockDescription, isExist } from '@shared/helpers';
import { Optional, Token } from '@shared/types';
import { useConfirmationModal } from '@shared/utils';
import { i18n } from '@translation';

export interface ConfirmationMessageParams {
  totalDeposit: Optional<BigNumber>;
  waitingTimeSeconds: BigNumber.Value;
  rewardToken: Token;
  lostRewardAmount: BigNumber;
}

const getConfirmationMessage = ({
  totalDeposit,
  waitingTimeSeconds,
  rewardToken,
  lostRewardAmount
}: ConfirmationMessageParams) => {
  if (!isExist(totalDeposit) || totalDeposit.isZero()) {
    return i18n.t('farm|youvesConfirmationNewStake');
  }

  if (lostRewardAmount.isZero()) {
    return null;
  }

  return i18n.t('farm|youvesConfirmationUpdateStake', {
    waitingTime: getFullTimelockDescription(waitingTimeSeconds, true),
    reward: `${formatValueBalance(lostRewardAmount, rewardToken.metadata.decimals)} ${rewardToken.metadata.symbol}`
  });
};

export const useYouvesStakeConfirmationPopup = (
  getConfirmationMessageParams: (amountToStake: BigNumber) => ConfirmationMessageParams
) => {
  const { openConfirmationModal } = useConfirmationModal();

  return (yesCallback: () => Promise<void>, amountToStake: BigNumber) => {
    const message = getConfirmationMessage(getConfirmationMessageParams(amountToStake));

    if (isExist(message)) {
      return openConfirmationModal({ message, yesCallback });
    }

    return yesCallback();
  };
};
