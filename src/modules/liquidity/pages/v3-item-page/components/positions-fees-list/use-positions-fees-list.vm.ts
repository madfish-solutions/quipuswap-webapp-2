import { getSumOfNumbers } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { usePositionsStats } from '../../hooks/use-positions-stats';

export const usePositionsFeesListViewModel = () => {
  const { t } = useTranslation();
  const { stats: positionsStats, loading, error } = usePositionsStats();

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount: getSumOfNumbers(positionsStats.map(({ depositUsd }) => depositUsd)),
    totalDepositLoading: loading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = getSumOfNumbers(positionsStats.map(({ collectedFeesUsd }) => collectedFeesUsd));

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
