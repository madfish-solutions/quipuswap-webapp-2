import { useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { TTDEX_CONTRACTS } from '@app.config';
import { useNetwork } from '@utils/dapp';
import { fromDecimals, getPriceImpact, getTokenOutput, toDecimals } from '@utils/helpers';
import { getRateByInputOutput } from '@utils/helpers/rates';
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

export const useSwapDetails = (params: SwapDetailsParams) => {
  const { dexRoute, inputToken, outputToken, inputAmount, outputAmount, slippageTolerance } = params;
  const network = useNetwork();
  const swapFee = useSwapFee({ ...params, dexChain: dexRoute });

  const sellRate =
    inputToken && outputToken && inputAmount?.gt(0) && outputAmount
      ? getRateByInputOutput(inputAmount, outputAmount, outputToken.metadata.decimals)
      : null;

  const buyRate = useMemo(() => {
    if (inputToken && outputToken && outputAmount?.gt(0) && dexRoute && dexRoute.length > 0) {
      const reversedRoute = [...dexRoute].reverse();
      try {
        const tokenBAmount = outputAmount;
        const tokenAAmount = fromDecimals(
          getTokenOutput({
            inputToken: outputToken,
            inputAmount: toDecimals(outputAmount, outputToken),
            dexChain: reversedRoute
          }),
          inputToken
        );

        return tokenAAmount.div(tokenBAmount).decimalPlaces(inputToken.metadata.decimals);
      } catch (_) {
        // return statement is below
      }
    }

    return null;
  }, [dexRoute, inputToken, outputAmount, outputToken]);

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
        : undefined,
    buyRate,
    sellRate
  };
};
