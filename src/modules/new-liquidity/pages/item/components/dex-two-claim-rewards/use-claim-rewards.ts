import { useCallback } from 'react';

import { sendBatch } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { getContract } from '@shared/dapp';
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
    if (isNull(item) || isNull(tezos)) {
      return;
    }

    try {
      const contract = await getContract(tezos, item.contractAddress);

      const params = contract.methodsObject
        .withdraw_profit({ pair_id: item.id, receiver: accountPkh, referral_code: QUIPUSWAP_REFERRAL_CODE })
        .toTransferParams();

      const operation = await sendBatch(tezos, [params]);

      await confirmOperation(operation.opHash, { message: 'claimRewardsSuccess' });
      log('CLAIM_NEW_LIQUIDITY_REWARDS', { contractAddress: item.contractAddress, farmingId: item.id });
    } catch (error) {
      showErrorToast(error as Error);
      log('CLAIM_NEW_LIQUIDITY_REWARDS_FAIL', { contractAddress: item.contractAddress, farmingId: item.id, error });
    }
  }, [accountPkh, confirmOperation, item, log, showErrorToast, tezos]);

  return { claim };
};
