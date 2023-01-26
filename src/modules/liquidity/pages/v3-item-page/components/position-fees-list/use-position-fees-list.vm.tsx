import { ZERO_AMOUNT_BN } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import {
  useLiquidityV3ItemTokens,
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3PositionStore,
  useLiquidityV3PoolStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { defined, getSumOfNumbers, isExist, isTezosToken, toAtomic } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { findUserPosition } from '../../helpers';
import { useLiquidityV3ItemTokensExchangeRates } from '../../hooks';
import { usePositionsWithStats } from '../../hooks/use-positions-with-stats';
import { PositionFeeTokensList } from '../position-fee-tokens-list';

export const usePositionFeesListViewModel = () => {
  const { t } = useTranslation();
  const { positionsWithStats, loading, error } = usePositionsWithStats();
  const { showErrorToast } = useToasts();
  const { positionId } = useLiquidityV3PositionStore();
  const v3PoolStore = useLiquidityV3PoolStore();
  const { isExchangeRatesError } = useLiquidityV3ItemTokensExchangeRates();
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();
  const confirmOperation = useConfirmOperation();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const contractAddress = v3PoolStore.item?.contractAddress;

  const userPosition = findUserPosition(positionsWithStats, positionId);

  const userTotalDepositInfo = {
    totalDepositAmount: userPosition?.stats.depositUsd ?? ZERO_AMOUNT_BN,
    totalDepositLoading: loading,
    totalDepositError: error
  };
  const isUserTotalDepositExist =
    (!userTotalDepositInfo.totalDepositAmount.isZero() || userTotalDepositInfo.totalDepositLoading) &&
    !Boolean(userTotalDepositInfo.totalDepositError);
  const claimablePendingRewardsInUsd = userPosition?.stats.collectedFeesUsd ?? ZERO_AMOUNT_BN;

  const handleClaimAll = async () => {
    const logData = {
      contractAddress,
      positionsId: positionId?.toNumber(),
      rewardsInUsd: claimablePendingRewardsInUsd?.toNumber()
    };
    try {
      amplitudeService.logEvent('CLAIM_V3_FEE_CLICK', logData);
      const rewardInTez = getSumOfNumbers([
        isExist(tokenX) && isTezosToken(tokenX) ? userPosition!.stats.tokenXFees : ZERO_AMOUNT_BN,
        isExist(tokenY) && isTezosToken(tokenY) ? userPosition!.stats.tokenYFees : ZERO_AMOUNT_BN
      ]);
      const operation = await V3LiquidityPoolApi.claimFees(
        defined(tezos, 'tezos'),
        defined(contractAddress, 'contractAddress'),
        [defined(positionId, 'positionId')],
        defined(accountPkh, 'accountPkh'),
        transactionDeadline,
        toAtomic(rewardInTez, TEZOS_TOKEN)
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|claimingSuccessful') });
      void getLiquidityV3ItemWithPositions();
      amplitudeService.logEvent('CLAIM_V3_FEE_SUCCESS', logData);
    } catch (claimError) {
      showErrorToast(claimError as Error);
      amplitudeService.logEvent('CLAIM_V3_FEE_FAILED', logData);
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
    details: !userTotalDepositInfo.totalDepositAmount.isZero() && <PositionFeeTokensList />,
    isRewardsError: isExchangeRatesError
  };
};
