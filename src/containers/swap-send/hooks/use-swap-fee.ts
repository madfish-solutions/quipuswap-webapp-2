import { useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import debouncePromise from 'debounce-promise';

import { TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useAccountPkh, useEstimationToolkit } from '@utils/dapp';
import { estimateSwapFee, fromDecimals, toDecimals } from '@utils/helpers';
import { DexPair, Nullable, Undefined, WhitelistedToken } from '@utils/types';

interface SwapParams {
  inputToken: Undefined<WhitelistedToken>;
  inputAmount: Undefined<BigNumber>;
  outputAmount: Undefined<BigNumber>;
  dexChain: Undefined<DexPair[]>;
  slippageTolerance: Undefined<BigNumber>;
  recipient: Undefined<string>;
}

const WHOLE_ITEM_PERCENT = 100;
const DEBOUNCE_DELAY = 250;

export const useSwapFee = ({ inputToken, inputAmount, dexChain, slippageTolerance, recipient }: SwapParams) => {
  const accountPkh = useAccountPkh();
  const tezos = useEstimationToolkit();

  const [swapFee, setSwapFee] = useState<Nullable<BigNumber>>(null);

  const updateSwapFee = useMemo(
    () =>
      debouncePromise(async () => {
        if (accountPkh && inputToken && dexChain && inputAmount) {
          try {
            const rawNewFee = await estimateSwapFee(tezos!, accountPkh, {
              inputToken: inputToken,
              inputAmount: toDecimals(inputAmount, inputToken),
              dexChain,
              recipient,
              slippageTolerance: slippageTolerance?.div(WHOLE_ITEM_PERCENT),
              ttDexAddress: TOKEN_TO_TOKEN_DEX
            });
            setSwapFee(fromDecimals(rawNewFee, TEZOS_TOKEN));

            return;
          } catch (_) {
            // swap fee is reset below
          }
        }
        setSwapFee(null);
      }, DEBOUNCE_DELAY),
    [accountPkh, dexChain, inputAmount, inputToken, recipient, slippageTolerance, tezos]
  );
  useEffect(() => void updateSwapFee(), [updateSwapFee]);

  return swapFee;
};
