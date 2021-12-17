import { useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import debouncePromise from 'debounce-promise';

import { useAccountPkh, useNetwork, useTezos } from '@utils/dapp';
import { TEZOS_TOKEN, TTDEX_CONTRACTS } from '@utils/defaults';
import { estimateSwapFee, fromDecimals, toDecimals } from '@utils/helpers';
import { DexPair, WhitelistedToken } from '@utils/types';

interface SwapParams {
  inputToken?: WhitelistedToken;
  inputAmount?: BigNumber;
  outputAmount?: BigNumber;
  dexChain?: DexPair[];
  slippageTolerance?: BigNumber;
  recipient?: string;
}

const WHOLE_ITEM_PERCENT = 100;
const DEBOUNCE_DELAY = 250;

export const useSwapFee = ({ inputToken, inputAmount, dexChain, slippageTolerance, recipient }: SwapParams) => {
  const accountPkh = useAccountPkh();
  const network = useNetwork();
  const tezos = useTezos();

  const [swapFee, setSwapFee] = useState<BigNumber>();
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
              ttDexAddress: TTDEX_CONTRACTS[network.id]
            });
            setSwapFee(fromDecimals(rawNewFee, TEZOS_TOKEN));

            return;
          } catch (_) {
            // swap fee is reset below
          }
        }
        setSwapFee(undefined);
      }, DEBOUNCE_DELAY),
    [accountPkh, dexChain, inputAmount, inputToken, network.id, recipient, slippageTolerance, tezos]
  );
  useEffect(() => void updateSwapFee(), [updateSwapFee]);

  return swapFee;
};
