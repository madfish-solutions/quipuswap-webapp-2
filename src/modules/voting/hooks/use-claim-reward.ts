import { useCallback } from 'react';

import { batchify, FoundDex, withdrawReward } from '@quipuswap/sdk';

import { TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getDollarEquivalent, getTokenSlug, getTokenSymbol } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { useRewards, useTokensPair } from '../helpers/voting.provider';

export const useClaimRewards = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();
  const { rewards } = useRewards();
  const { tokenPair } = useTokensPair();
  const exchangeRates = useNewExchangeRates();

  return useCallback(
    async (dex: Nullable<FoundDex>) => {
      if (!tezos || !dex || !accountPkh) {
        return null;
      }

      const logData = {
        claimRewards: {
          contract: dex.contract.address,
          rewards: Number(rewards),
          rewardsUsd: Number(getDollarEquivalent(rewards, exchangeRates[TEZOS_TOKEN.contractAddress])),
          balance: Number(tokenPair?.balance),
          frozenBalance: Number(tokenPair?.frozenBalance),
          token1Slug: tokenPair?.token1 ? getTokenSlug(tokenPair.token1) : null,
          token2Slug: tokenPair?.token2 ? getTokenSlug(tokenPair.token2) : null,
          token1Symbol: tokenPair?.token1 ? getTokenSymbol(tokenPair.token1) : null,
          token2Symbol: tokenPair?.token2 ? getTokenSymbol(tokenPair.token2) : null
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
    [
      tezos,
      accountPkh,
      rewards,
      exchangeRates,
      tokenPair?.balance,
      tokenPair?.frozenBalance,
      tokenPair?.token1,
      tokenPair?.token2,
      confirmOperation,
      showErrorToast
    ]
  );
};
