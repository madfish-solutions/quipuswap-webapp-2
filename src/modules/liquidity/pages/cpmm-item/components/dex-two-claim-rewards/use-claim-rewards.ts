import { useCallback } from 'react';

import { claimLiquidityBakerRewards, ClaimRequestBody, Payload } from '@modules/liquidity/api';
import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useGetPublicKey, useSignMessage } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { useAmplitudeService, useAuthStore } from '@shared/hooks';
import { useToasts, useConfirmOperation } from '@shared/utils';

//CLAIM REWARDS
export const useClaimRewards = () => {
  const { item } = useLiquidityItemStore();
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { log } = useAmplitudeService();
  const { accountPkh } = useAuthStore();

  const signMessage = useSignMessage();
  const getPublicKey = useGetPublicKey();

  const claim = useCallback(async () => {
    if (isNull(item) || isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    try {
      log('CLAIM_NEW_LIQUIDITY_REWARDS', { contractAddress: item.contractAddress, poolId: item.id });
      const publicKey = await getPublicKey();

      const payload: Payload = {
        publicKey,
        poolId: item.id.toString(),
        timestamp: new Date().toISOString()
      };
      const { signature, payloadBytes } = await signMessage(payload);

      const body: ClaimRequestBody = {
        payload,
        payloadBytes,
        signature
      };
      const operation = await claimLiquidityBakerRewards(body);

      await confirmOperation(operation.opHash, { message: 'claimRewardsSuccess' });
      log('CLAIM_NEW_LIQUIDITY_REWARDS_SUCCESS', { contractAddress: item.contractAddress, poolId: item.id });
    } catch (error) {
      showErrorToast(error as Error);
      log('CLAIM_NEW_LIQUIDITY_REWARDS_FAIL', { contractAddress: item.contractAddress, poolId: item.id, error });
    }
  }, [accountPkh, confirmOperation, getPublicKey, item, log, showErrorToast, signMessage, tezos]);

  return { claim };
};
