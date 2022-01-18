import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { TTDEX_CONTRACTS } from '@app.config';
import { useDexGraph } from '@hooks/use-dex-graph';
import { useNetwork } from '@utils/dapp';
import {
  fromDecimals,
  getMaxTokenInput,
  getPriceImpact,
  getTokenOutput,
  getTokenSlug,
  toDecimals
} from '@utils/helpers';
import { getRateByInputOutput } from '@utils/helpers/rates';
import { getMaxInputRoute, getRouteWithInput } from '@utils/routing';
import { DexPair, Undefined, WhitelistedToken } from '@utils/types';

import { useSwapFee } from './use-swap-fee';

interface SwapDetailsParams {
  inputToken: Undefined<WhitelistedToken>;
  outputToken: Undefined<WhitelistedToken>;
  inputAmount: Undefined<BigNumber>;
  outputAmount: Undefined<BigNumber>;
  slippageTolerance: Undefined<BigNumber>;
  dexRoute: Undefined<DexPair[]>;
  recipient: Undefined<string>;
}

const WHOLE_ITEM_PERCENT = 100;
const ZERO = 0;
const DEFAULT_REVERSE_INPUT_AMOUNT = 1;

export const useSwapDetails = (params: SwapDetailsParams) => {
  const { dexRoute, inputToken, outputToken, inputAmount, outputAmount, slippageTolerance } = params;
  const { dexGraph } = useDexGraph();
  const network = useNetwork();
  const swapFee = useSwapFee({ ...params, dexChain: dexRoute });

  const sellRate =
    inputToken && outputToken && inputAmount?.gt(ZERO) && outputAmount
      ? getRateByInputOutput(inputAmount, outputAmount, outputToken.metadata.decimals)
      : null;

  const buyRate = useMemo(() => {
    if (inputToken && outputToken && outputAmount?.gt(ZERO) && dexRoute && dexRoute.length > ZERO) {
      try {
        const maxReverseInputRoute = getMaxInputRoute({
          startTokenSlug: getTokenSlug(outputToken),
          endTokenSlug: getTokenSlug(inputToken),
          graph: dexGraph
        })!;
        const maxReverseInput = getMaxTokenInput(outputToken, maxReverseInputRoute);
        const probeReverseInput = BigNumber.minimum(
          toDecimals(new BigNumber(DEFAULT_REVERSE_INPUT_AMOUNT), outputToken),
          maxReverseInput
        );

        const reverseDexChain = getRouteWithInput({
          inputAmount: probeReverseInput,
          startTokenSlug: getTokenSlug(outputToken),
          endTokenSlug: getTokenSlug(inputToken),
          graph: dexGraph
        })!;
        const probeReverseOutput = getTokenOutput({
          inputToken: outputToken,
          inputAmount: probeReverseInput,
          dexChain: reverseDexChain
        });

        return fromDecimals(probeReverseOutput, inputToken)
          .dividedBy(fromDecimals(probeReverseInput, outputToken))
          .decimalPlaces(inputToken.metadata.decimals);
      } catch (_) {
        // return statement is below
      }
    }

    return null;
  }, [dexRoute, inputToken, outputAmount, outputToken, dexGraph]);

  return {
    swapFee,
    priceImpact:
      inputToken && inputAmount && dexRoute && slippageTolerance
        ? getPriceImpact({
            inputToken: inputToken,
            inputAmount: toDecimals(inputAmount, inputToken),
            dexChain: dexRoute,
            slippageTolerance: slippageTolerance?.div(WHOLE_ITEM_PERCENT),
            ttDexAddress: TTDEX_CONTRACTS[network.id]
          })
        : null,
    buyRate,
    sellRate
  };
};
