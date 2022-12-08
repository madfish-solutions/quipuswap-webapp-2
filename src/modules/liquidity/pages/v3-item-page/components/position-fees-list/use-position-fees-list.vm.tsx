import { ZERO_AMOUNT_BN } from '@config/constants';
import { useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionFeeTokensList } from '../position-fee-tokens-list';

export const usePositionFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positionsWithStats, loading, error } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount:
      isExist(positionId) && isExist(positionsWithStats[positionId]?.stats)
        ? positionsWithStats[positionId].stats.depositUsd
        : ZERO_AMOUNT_BN,
    totalDepositLoading: loading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd =
    isExist(positionId) && isExist(positionsWithStats[positionId]?.stats)
      ? positionsWithStats[positionId].stats.collectedFeesUsd
      : ZERO_AMOUNT_BN;

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
    claimablePendingRewards: claimablePendingRewardsInUsd,
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionFeeTokensList />
  };
};
