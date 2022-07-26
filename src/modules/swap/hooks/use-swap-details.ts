import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';
import { getBestTradeExactInput, getMaxInputRoute, getTradeOutputAmount } from 'swap-router-sdk';

import { ZERO_AMOUNT } from '@config/constants';
import { toReal, getRateByInputOutput, isEmptyArray, toAtomic } from '@shared/helpers';

import { useRoutePairs } from '../providers/route-pairs-provider';
import { useRoutePairsCombinations } from '../utils/swap-router-sdk-adapters';
import { SwapDetailsParams } from '../utils/types';
import { usePriceImpact } from './use-price-impact';
import { useSwapFee } from './use-swap-fee';

const DEFAULT_REVERSE_INPUT_AMOUNT = 1;

export const useSwapDetails = (params: SwapDetailsParams) => {
  const { trade, inputToken, outputToken, inputAmount, outputAmount } = params;
  const priceImpact = usePriceImpact(trade);
  const { data: swapFee = null, error: swapFeeError } = useSwapFee(params);
  const { routePairs } = useRoutePairs();
  const reverseRoutePairsCombinations = useRoutePairsCombinations(outputToken, inputToken, routePairs);

  const sellRate = useMemo(
    () =>
      inputToken && outputToken && inputAmount?.gt(ZERO_AMOUNT) && outputAmount
        ? getRateByInputOutput(inputAmount, outputAmount, outputToken.metadata.decimals)
        : null,
    [inputAmount, inputToken, outputAmount, outputToken]
  );

  const buyRate = useMemo(() => {
    if (inputToken && outputToken && outputAmount?.gt(ZERO_AMOUNT) && trade && !isEmptyArray(trade)) {
      try {
        const { value: maxReverseInput } = getMaxInputRoute(reverseRoutePairsCombinations);
        const probeReverseInput = BigNumber.minimum(
          toAtomic(new BigNumber(DEFAULT_REVERSE_INPUT_AMOUNT), outputToken),
          maxReverseInput
        );

        const reverseTrade = getBestTradeExactInput(probeReverseInput, reverseRoutePairsCombinations);
        if (isEmptyArray(reverseTrade)) {
          return !sellRate || sellRate.eq(ZERO_AMOUNT)
            ? null
            : new BigNumber(1).div(sellRate).decimalPlaces(inputToken.metadata.decimals);
        }

        const probeReverseOutput = getTradeOutputAmount(reverseTrade)!;

        return toReal(probeReverseOutput, inputToken)
          .dividedBy(toReal(probeReverseInput, outputToken))
          .decimalPlaces(inputToken.metadata.decimals);
      } catch (_) {
        // return statement is below
      }
    }

    return null;
  }, [trade, inputToken, outputAmount, outputToken, reverseRoutePairsCombinations, sellRate]);

  return {
    swapFee,
    swapFeeError,
    priceImpact,
    buyRate,
    sellRate
  };
};
