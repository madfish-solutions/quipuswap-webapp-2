import { AppRootRoutes } from '@app.router';
import { getSumOfNumbers, isEmptyArray, isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { getPositionsIdsWithFees } from './get-positions-ids-with-fees.helper';
import { useClaimAll, useClaimablePendingRewardsInUsd } from './hooks';
import { useLiquidityV3ItemTokensExchangeRates } from '../../hooks';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionsFeeTokensList } from '../positions-fee-tokens-list';

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
      backToTheListTranslation: t('common|Back to the list'),
      claimFeeTranslation: t('liquidity|claimFee'),
      rewardsTooltipTranslation: t('liquidity|rewardsTooltip'),
      totalFeesTranslation: t('liquidity|totalFees'),
      totalDepositTranslation: t('liquidity|totalDeposit'),
      totalDepositTooltipTranslation: t('liquidity|totalDepositTooltip')
    },
    claimablePendingRewards: claimablePendingRewardsInUsd,
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionsFeeTokensList />,
    claimIsDisabled,
    isRewardsError: isExchangeRatesError || (!loading && isNull(claimablePendingRewardsInUsd)),
    backHref: AppRootRoutes.Liquidity
  };
};
