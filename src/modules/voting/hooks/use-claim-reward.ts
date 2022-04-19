import { useCallback } from 'react';

import { batchify, FoundDex, withdrawReward } from '@quipuswap/sdk';

import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getTokenSlug } from '@shared/helpers';
import { useToasts } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { Nullable } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

import { useRewards, useTokensPair } from '../helpers/voting.provider';

export const useClaimRewards = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { rewards } = useRewards();
  const { tokenPair } = useTokensPair();

  return useCallback(
    async (dex: Nullable<FoundDex>) => {
      if (!tezos || !dex || !accountPkh) {
        return null;
      }

      const logData = {
        claimRewards: {
          dexContract: dex.contract.address,
          rewards,
          tokenPair: {
            balance: tokenPair?.balance,
            frozenBalance: tokenPair?.frozenBalance,
            token1: tokenPair?.token1 ? getTokenSlug(tokenPair.token1) : null,
            token2: tokenPair?.token2 ? getTokenSlug(tokenPair.token2) : null
          }
        }
      };

      try {
        amplitudeService.logEvent('CLAIM_REWARDS', logData);
        const claimParams = await withdrawReward(tezos, dex, accountPkh);
        const op = await batchify(tezos.wallet.batch([]), claimParams).send();
        await confirmOperation(op.opHash);
        amplitudeService.logEvent('CLAIM_REWARDS_SUCCESS', logData);
      } catch (error) {
        showErrorToast(error as Error);
        amplitudeService.logEvent('CLAIM_REWARDS_FAILED', { ...logData, error });
      }
    },
    [tezos, accountPkh, tokenPair, rewards, confirmOperation, showErrorToast]
  );
};
