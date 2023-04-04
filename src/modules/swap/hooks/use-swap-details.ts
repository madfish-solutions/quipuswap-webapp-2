import { useMemo } from 'react';

import { ZERO_AMOUNT } from '@config/constants';
import { getRateByInputOutput } from '@shared/helpers';

import { SwapDetailsParams } from '../utils/types';
import { usePriceImpact } from './use-price-impact';
import { useRealSwapFee } from './use-swap-fee';

export const useRealSwapDetails = (params: SwapDetailsParams) => {
  const { noMediatorsTrade, inputToken, outputToken, inputAmount, outputAmount } = params;
  const priceImpact = usePriceImpact(noMediatorsTrade);
  const { data: swapFee = null, error: swapFeeError } = useRealSwapFee(params);

  const sellRate = useMemo(
    () =>
      inputToken && outputToken && inputAmount?.gt(ZERO_AMOUNT) && outputAmount
        ? getRateByInputOutput(inputAmount, outputAmount, outputToken.metadata.decimals)
        : null,
    [inputAmount, inputToken, outputAmount, outputToken]
  );

  return {
    swapFee,
    swapFeeError,
    priceImpact,
    sellRate
  };
};
