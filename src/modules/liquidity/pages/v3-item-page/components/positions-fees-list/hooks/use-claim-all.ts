import { ZERO_AMOUNT_BN } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { V3LiquidityPoolApi } from '@modules/liquidity/api';
import {
  useGetLiquidityV3ItemWithPositions,
  useLiquidityV3ItemTokens,
  useLiquidityV3PoolStore
} from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { defined, getSumOfNumbers, isExist, isTezosToken, toAtomic } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { usePositionsWithStats } from '../../../hooks/use-positions-with-stats';
import { getPositionsIdsWithFees } from '../get-positions-ids-with-fees.helper';
import { useClaimablePendingRewardsInUsd } from './use-claimable-pending-rewards-in-usd';

export const useClaimAll = () => {
  const { t } = useTranslation();
  const { showErrorToast } = useToasts();
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();
  const v3PoolStore = useLiquidityV3PoolStore();
  const {
    settings: { transactionDeadline }
  } = useSettingsStore();
  const { positionsWithStats } = usePositionsWithStats();
  const { getLiquidityV3ItemWithPositions } = useGetLiquidityV3ItemWithPositions();
  const confirmOperation = useConfirmOperation();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const claimablePendingRewardsInUsd = useClaimablePendingRewardsInUsd();

  const contractAddress = v3PoolStore.item?.contractAddress;
  const positionsIdsWithFees = getPositionsIdsWithFees(positionsWithStats);

  return async () => {
    const logData = {
      contractAddress,
      positionsIds: positionsIdsWithFees.map(id => id.toNumber()),
      rewardsInUsd: claimablePendingRewardsInUsd?.toNumber()
    };
    try {
      amplitudeService.logEvent('CLAIM_V3_FEES_CLICK', logData);
      const rewardsInTez = getSumOfNumbers(
        positionsWithStats
          .map(({ stats }) => [
            isExist(tokenX) && isTezosToken(tokenX) ? stats.tokenXFees : ZERO_AMOUNT_BN,
            isExist(tokenY) && isTezosToken(tokenY) ? stats.tokenYFees : ZERO_AMOUNT_BN
          ])
          .flat()
      );
      const operation = await V3LiquidityPoolApi.claimFees(
        defined(tezos, 'tezos'),
        defined(contractAddress, 'contractAddress'),
        positionsIdsWithFees,
        defined(accountPkh, 'accountPkh'),
        transactionDeadline,
        toAtomic(rewardsInTez, TEZOS_TOKEN)
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|claimingSuccessful') });
      void getLiquidityV3ItemWithPositions();
      amplitudeService.logEvent('CLAIM_V3_FEES_SUCCESS', logData);
    } catch (claimError) {
      showErrorToast(claimError as Error);
      amplitudeService.logEvent('CLAIM_V3_FEES_FAILED', logData);
    }
  };
};
