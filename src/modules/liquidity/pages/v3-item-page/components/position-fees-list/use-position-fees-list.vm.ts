import BigNumber from 'bignumber.js';

import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useV3ItemPageViewModel } from '../../use-v3-item-page.vm';

export const usePositionFeesListViewModel = () => {
  const { t } = useTranslation();
  const { isLoading, error } = useV3ItemPageViewModel();

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount: new BigNumber(1),
    totalDepositLoading: isLoading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = new BigNumber(1);

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    onButtonClick: handleClaimAll,
    translation: {
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit')
    },
    claimablePendingRewards: claimablePendingRewardsInUsd
  };
};
