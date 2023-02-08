import { getSumOfNumbers, isEmptyArray } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useLiquidityV3ItemTokensExchangeRates } from '../../hooks';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionsFeeTokensList } from '../positions-fee-tokens-list';
import { getPositionsIdsWithFees } from './get-positions-ids-with-fees.helper';
import { useClaimAll, useClaimablePendingRewardsInUsd } from './hooks';

export const usePositionsFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positionsWithStats, loading, error: positionsError } = usePositionsWithStats();
  const { isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();
  const claimablePendingRewardsInUsd = useClaimablePendingRewardsInUsd();

  const positionsIdsWithFees = getPositionsIdsWithFees(positionsWithStats);
  const claimIsDisabled = isEmptyArray(positionsIdsWithFees);

  const userTotalDepositInfo = {
    totalDepositAmount: getSumOfNumbers(positionsWithStats.map(({ stats }) => stats.depositUsd)),
    totalDepositLoading: loading,
    totalDepositError: isExchangeRatesError ? t('liquidity|v3ExchangeRatesError') : positionsError
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);

  const claimAll = useClaimAll();

  return {
    userTotalDepositInfo,
    isUserTotalDepositExist,
    onButtonClick: claimAll,
    translation: {
      claimFeeTranslation: t('liquidity|claimFee'),
      rewardsTooltipTranslation: t('liquidity|rewardsTooltip'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit'),
      totalDepositTooltipTranslation: t('liquidity|totalDepositTooltip')
    },
    claimablePendingRewards: claimablePendingRewardsInUsd,
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionsFeeTokensList />,
    claimIsDisabled,
    isRewardsError: isExchangeRatesError
  };
};
