import { getSumOfNumbers } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { useV3PositionsViewModel } from '../../use-v3-positions.vm';

export const usePositionsFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positions, isLoading, error } = useV3PositionsViewModel();

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount: getSumOfNumbers(positions.map(position => position.depositUsd)),
    totalDepositLoading: isLoading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = getSumOfNumbers(positions.map(position => position.collectedFeesUsd));

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    handleClaimAll,
    translation: {
      harvestAllTranslation: t('farm|harvestAll'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit')
    },
    claimablePendingRewardsInUsd
  };
};
