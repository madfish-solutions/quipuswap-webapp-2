import { useCallback } from 'react';

import { claimNewLiquidityBackerRewards } from '@modules/new-liquidity/api';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { isNull } from '@shared/helpers';
import { useAmplitudeService, useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';

export const useClaimRewards = () => {
  const { item } = useNewLiquidityItemStore();
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { log } = useAmplitudeService();
  const { accountPkh } = useAuthStore();

  const claim = useCallback(async () => {
    if (isNull(item) || isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    try {
      log('CLAIM_NEW_LIQUIDITY_REWARDS', { contractAddress: item.contractAddress, farmingId: item.id });
      const operation = await claimNewLiquidityBackerRewards(tezos, item.contractAddress, item.id, accountPkh);

      await confirmOperation(operation.opHash, { message: 'claimRewardsSuccess' });
      log('CLAIM_NEW_LIQUIDITY_REWARDS_SUCCESS', { contractAddress: item.contractAddress, farmingId: item.id });
    } catch (error) {
      showErrorToast(error as Error);
      log('CLAIM_NEW_LIQUIDITY_REWARDS_FAIL', { contractAddress: item.contractAddress, farmingId: item.id, error });
    }
  }, [accountPkh, confirmOperation, item, log, showErrorToast, tezos]);

  return { claim };
};
