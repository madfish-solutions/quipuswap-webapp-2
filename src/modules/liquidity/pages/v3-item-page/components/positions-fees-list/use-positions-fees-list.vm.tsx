import { useMemo } from 'react';

import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import { useGetLiquidityV3ItemWithPositions, useLiquidityV3PoolStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { defined, getSumOfNumbers, isEmptyArray, isGreaterThanZero, isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { useLiquidityV3ItemTokensExchangeRates } from '../../hooks';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionsFeeTokensList } from '../positions-fee-tokens-list';

export const usePositionsFeesListViewModel = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const v3PoolStore = useLiquidityV3PoolStore();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();
  const { positionsWithStats, loading, error: positionsError } = usePositionsWithStats();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();
  const { isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();
  const confirmOperation = useConfirmOperation();

  const contractAddress = v3PoolStore.item?.contractAddress;

  const positionsIdsWithFees = positionsWithStats
    .filter(({ stats }) => isGreaterThanZero(stats.tokenXFees) || isGreaterThanZero(stats.tokenYFees))
    .map(({ id }) => id);
  const claimIsDisabled = isEmptyArray(positionsIdsWithFees);

  const userTotalDepositInfo = {
    totalDepositAmount: getSumOfNumbers(positionsWithStats.map(({ stats }) => stats.depositUsd)),
    totalDepositLoading: loading,
    totalDepositError: isExchangeRatesError ? t('liquidity|v3ExchangeRatesError') : positionsError
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = useMemo(() => {
    const addends = positionsWithStats.map(({ stats }) => stats.collectedFeesUsd);

    return addends.every(isNull) ? null : getSumOfNumbers(addends);
  }, [positionsWithStats]);

  const handleClaimAll = async () => {
    const logData = {
      contractAddress,
      positionsIds: positionsIdsWithFees.map(id => id.toNumber()),
      rewardsInUsd: claimablePendingRewardsInUsd?.toNumber()
    };
    try {
      amplitudeService.logEvent('CLAIM_V3_FEES_CLICK', logData);
      const operation = await V3LiquidityPoolApi.claimFees(
        defined(tezos, 'tezos'),
        defined(contractAddress, 'contractAddress'),
        positionsIdsWithFees,
        defined(accountPkh, 'accountPkh'),
        transactionDeadline
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|claimingSuccessful') });
      void getLiquidityV3ItemWithPositions();
      amplitudeService.logEvent('CLAIM_V3_FEES_SUCCESS', logData);
    } catch (claimError) {
      showErrorToast(claimError as Error);
      amplitudeService.logEvent('CLAIM_V3_FEES_FAILED', logData);
    }
  };

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
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionsFeeTokensList />,
    claimIsDisabled,
    isRewardsError: isExchangeRatesError
  };
};
