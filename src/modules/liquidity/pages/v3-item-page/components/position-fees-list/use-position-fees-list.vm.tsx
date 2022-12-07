import BigNumber from 'bignumber.js';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { isExist } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionFeeTokensList } from '../position-fee-tokens-list';

export const usePositionFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positionsWithStats, loading, error } = usePositionsWithStats();
  const { positionId } = useLiquidityV3ItemStore();

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount:
      isExist(positionId) && isExist(positionsWithStats[Number(positionId)]?.stats)
        ? positionsWithStats[Number(positionId)].stats.depositUsd
        : new BigNumber(0),
    totalDepositLoading: loading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd =
    isExist(positionId) && isExist(positionsWithStats[Number(positionId)]?.stats)
      ? positionsWithStats[positionId].stats.collectedFeesUsd
      : new BigNumber(0);

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
