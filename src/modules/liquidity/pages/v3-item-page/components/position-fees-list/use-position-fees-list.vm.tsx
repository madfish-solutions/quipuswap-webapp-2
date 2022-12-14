import { ZERO_AMOUNT_BN } from '@config/constants';
import { useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { amplitudeService } from '@shared/services';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../helpers';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionFeeTokensList } from '../position-fee-tokens-list';

export const usePositionFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positionsWithStats, loading, error } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();

  const userPosition = findUserPosition(positionsWithStats, positionId);

  const handleClaimAll = () => amplitudeService.logEvent('CLAIM_ALL_FEES_CLICK');

  const userTotalDepositInfo = {
    totalDepositAmount: userPosition?.stats.depositUsd ?? ZERO_AMOUNT_BN,
    totalDepositLoading: loading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = userPosition?.stats.collectedFeesUsd ?? ZERO_AMOUNT_BN;

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    onButtonClick: handleClaimAll,
    translation: {
      claimFeeTranslation: t('liquidity|claimFee'),
      rewardsTooltipTranslation: t('farm|rewardsTooltip'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit')
    },
    claimablePendingRewards: claimablePendingRewardsInUsd,
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionFeeTokensList />
  };
};
