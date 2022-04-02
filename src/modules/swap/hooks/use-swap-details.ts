import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { TOKEN_TO_TOKEN_DEX } from '@config/config';
import {
  fromDecimals,
  getMaxInputRoute,
  getMaxTokenInput,
  getPriceImpact,
  getRateByInputOutput,
  getRouteWithInput,
  getTokenOutput,
  getTokenSlug,
  isEmptyArray,
  toDecimals
} from '@shared/helpers';
import { useDexGraph } from '@shared/hooks';
import { DexPair, Token, Undefined } from '@shared/types';

import { useSwapFee } from './use-swap-fee';

interface SwapDetailsParams {
  inputToken: Undefined<Token>;
  outputToken: Undefined<Token>;
  inputAmount: Undefined<BigNumber>;
  outputAmount: Undefined<BigNumber>;
  slippageTolerance: Undefined<BigNumber>;
  dexRoute: Undefined<DexPair[]>;
  recipient: Undefined<string>;
}

const WHOLE_ITEM_PERCENT = 100;
const MINIMAL_INPUT_AMOUNT = 0;
const DEFAULT_REVERSE_INPUT_AMOUNT = 1;

export const useSwapDetails = (params: SwapDetailsParams) => {
  const { dexRoute, inputToken, outputToken, inputAmount, outputAmount, slippageTolerance } = params;
  const { dexGraph } = useDexGraph();
  const { data: swapFee = null, error: swapFeeError } = useSwapFee({ ...params, dexChain: dexRoute });

  const sellRate =
    inputToken && outputToken && inputAmount?.gt(MINIMAL_INPUT_AMOUNT) && outputAmount
      ? getRateByInputOutput(inputAmount, outputAmount, outputToken.metadata.decimals)
      : null;

  const buyRate = useMemo(() => {
    if (inputToken && outputToken && outputAmount?.gt(MINIMAL_INPUT_AMOUNT) && dexRoute && !isEmptyArray(dexRoute)) {
      try {
        const maxReverseInputRoute = getMaxInputRoute({
          startTokenSlug: getTokenSlug(outputToken),
          endTokenSlug: getTokenSlug(inputToken),
          graph: dexGraph
        })!;
        const maxReverseInput = getMaxTokenInput(inputToken, maxReverseInputRoute);
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
    swapFeeError,
    priceImpact:
      inputToken && inputAmount && dexRoute && slippageTolerance
        ? getPriceImpact({
            inputToken: inputToken,
            inputAmount: toDecimals(inputAmount, inputToken),
            dexChain: dexRoute,
            slippageTolerance: slippageTolerance?.div(WHOLE_ITEM_PERCENT),
            ttDexAddress: TOKEN_TO_TOKEN_DEX
          })
        : null,
    buyRate,
    sellRate
  };
};
