import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@config/config';
import { useAccountPkh, useEstimationToolkit } from '@providers/use-dapp';
import { defined, fromDecimals, getTokenPairSlug, getTokenSlug, toDecimals } from '@shared/helpers';
import { estimateSwapFee } from '@shared/helpers/swap';
import { useUpdateOnBlockSWR } from '@shared/hooks';
import { DexPair, Nullable, Token, Undefined } from '@shared/types';

import { SwapFeeNotEnoughParametersError } from './use-swap-fee.errors';

interface SwapParams {
  inputToken: Undefined<Token>;
  inputAmount: Undefined<BigNumber>;
  outputAmount: Undefined<BigNumber>;
  dexChain: Undefined<DexPair[]>;
  slippageTolerance: Undefined<BigNumber>;
  recipient: Undefined<string>;
}

const WHOLE_ITEM_PERCENT = 100;

export const useSwapFee = ({ inputToken, inputAmount, dexChain, slippageTolerance, recipient }: SwapParams) => {
  const accountPkh = useAccountPkh();
  const tezos = useEstimationToolkit();

  const updateSwapFee = useCallback(
    async (_key: string, senderPkh: Nullable<string>, recipientPkh: Undefined<string>) => {
      if (senderPkh && inputToken && dexChain && inputAmount) {
        try {
          const rawNewFee = await estimateSwapFee(defined(tezos), senderPkh, {
            inputToken,
            inputAmount: toDecimals(inputAmount, inputToken),
            dexChain,
            recipient: recipientPkh,
            slippageTolerance: slippageTolerance?.div(WHOLE_ITEM_PERCENT),
            ttDexAddress: TOKEN_TO_TOKEN_DEX
          });

          return fromDecimals(rawNewFee, TEZOS_TOKEN);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Estimate Fee Error:', error);
        }
      }

      throw new SwapFeeNotEnoughParametersError();
    },
    [dexChain, inputAmount, inputToken, slippageTolerance, tezos]
  );

  const dexChainSWRKey = dexChain?.map(({ token1, token2 }) => getTokenPairSlug(token1, token2)).join(',') ?? null;

  return useUpdateOnBlockSWR(
    tezos,
    [
      'swap-fee',
      accountPkh,
      recipient,
      dexChainSWRKey,
      inputAmount?.toFixed(),
      inputToken && getTokenSlug(inputToken),
      slippageTolerance?.toFixed()
    ],
    updateSwapFee
  );
};
