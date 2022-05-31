import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';
import { Trade } from 'swap-router-sdk';

import { TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useEstimationToolkit } from '@providers/use-dapp';
import { defined, fromDecimals, getTokenSlug } from '@shared/helpers';
import { estimateSwapFee } from '@shared/helpers/swap';
import { useUpdateOnBlockSWR } from '@shared/hooks';
import { Nullable, Token, Undefined } from '@shared/types';

import { SwapFeeNotEnoughParametersError } from './use-swap-fee.errors';

interface SwapParams {
  inputToken: Undefined<Token>;
  inputAmount: Undefined<BigNumber>;
  outputAmount: Undefined<BigNumber>;
  trade: Nullable<Trade>;
  recipient: Undefined<string>;
}

export const useSwapFee = ({ inputToken, inputAmount, trade, recipient }: SwapParams) => {
  const accountPkh = useAccountPkh();
  const tezos = useEstimationToolkit();

  const updateSwapFee = useCallback(
    async (_key: string, senderPkh: Nullable<string>, recipientPkh: Undefined<string>) => {
      if (senderPkh && inputToken && trade && inputAmount) {
        try {
          const rawNewFee = await estimateSwapFee(defined(tezos), senderPkh, trade, recipientPkh);

          return fromDecimals(rawNewFee, TEZOS_TOKEN);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Estimate Fee Error:', error);
        }
      }

      throw new SwapFeeNotEnoughParametersError();
    },
    [trade, inputAmount, inputToken, tezos]
  );

  const tradeSWRKey =
    trade
      ?.map(
        ({ aTokenSlug, bTokenSlug, aTokenAmount, bTokenAmount }) =>
          `(${aTokenSlug},${bTokenSlug},${aTokenAmount.toFixed()},${bTokenAmount.toFixed()})`
      )
      .join(',') ?? null;

  return useUpdateOnBlockSWR(
    tezos,
    ['swap-fee', accountPkh, recipient, tradeSWRKey, inputAmount?.toFixed(), inputToken && getTokenSlug(inputToken)],
    updateSwapFee
  );
};
