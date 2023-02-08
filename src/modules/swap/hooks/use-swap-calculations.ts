import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade
} from 'swap-router-sdk';

import { toReal, isEmptyArray, toAtomic, getUniqArray, isExist } from '@shared/helpers';
import { useTokensLoader, useTokensStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable, Optional, Token } from '@shared/types';

import { useRoutePairs } from '../providers/route-pairs-provider';
import { DexPool } from '../types';
import { mapDexPairs } from '../utils/map-dex-pairs';
import {
  swapRouterSdkTokenSlugToQuipuTokenSlug,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from '../utils/swap-router-sdk-adapters';
import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken: Optional<Token>;
  outputToken: Optional<Token>;
}

const getTokenSlugsFromTrade = (trade: Nullable<Trade>): string[] => {
  if (!trade) {
    return [];
  }

  return getUniqArray(
    trade
      .map(
        ({
          aTokenSlug,
          aTokenStandard,
          bTokenSlug,
          bTokenStandard,
          cTokenSlug,
          cTokenStandard,
          dTokenSlug,
          dTokenStandard
        }) => {
          const standards = [aTokenStandard, bTokenStandard, cTokenStandard, dTokenStandard];

          return [aTokenSlug, bTokenSlug, cTokenSlug, dTokenSlug]
            .filter(isExist)
            .map((slug, index) => swapRouterSdkTokenSlugToQuipuTokenSlug(slug, standards[index]));
        }
      )
      .flat(),
    x => x
  );
};

export const useSwapCalculations = () => {
  const { routePairs } = useRoutePairs();

  const { tokens, loading: tokensLoading } = useTokensStore();
  const {
    settings: { tradingSlippage }
  } = useSettingsStore();

  const [dexRoute, setDexRoute] = useState<DexPool[]>();
  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>(null);

  const tokensSlugs = getTokenSlugsFromTrade(bestTrade);
  const allTokensAreLoaded = tokensSlugs.every(slug => tokens.has(slug));
  useTokensLoader(tokensSlugs);

  useEffect(() => {
    try {
      setDexRoute(mapDexPairs(bestTrade, tokens));
    } catch {
      setDexRoute(tokensLoading && !isEmptyArray(bestTrade) ? undefined : []);
    }
  }, [tokensLoading, bestTrade, tokens, allTokensAreLoaded]);

  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({ inputToken: null, outputToken: null });
  const [inputAmount, setInputAmount] = useState<Nullable<BigNumber>>(null);
  const [outputAmount, setOutputAmount] = useState<Nullable<BigNumber>>(null);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);

  const routePairsCombinations = useRoutePairsCombinations(inputToken, outputToken, routePairs);
  const atLeastOneRouteWithV3 = routePairsCombinations.some(pairs =>
    pairs.some(
      pair => pair.dexType === DexTypeEnum.QuipuSwapV3 && pair.aTokenPool.isPositive() && pair.bTokenPool.isPositive()
    )
  );
  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputAmount && toAtomic(inputAmount, inputToken),
    bestTrade,
    tradingSlippage
  );

  const resetCalculations = (
    initialInputAmount: Nullable<BigNumber> = null,
    initialOutputAmount: Nullable<BigNumber> = null
  ) => {
    setInputAmount(initialInputAmount);
    setOutputAmount(initialOutputAmount);
    setBestTrade(null);
  };

  const onInputAmountChange = (newInputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);

    if (!newInputAmount || !routePairsCombinations.length) {
      return resetCalculations(newInputAmount, null);
    }

    setInputAmount(newInputAmount);

    const bestTradeExact = getBestTradeExactInput(toAtomic(newInputAmount, inputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);

    const atomicOutputAmount = getTradeOutputAmount(bestTradeExact);
    setOutputAmount(atomicOutputAmount ? toReal(atomicOutputAmount, outputToken) : null);
  };

  const onOutputAmountChange = (newOutputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);

    if (!newOutputAmount || !routePairsCombinations.length) {
      return resetCalculations(null, newOutputAmount);
    }

    setOutputAmount(newOutputAmount);

    const bestTradeExact = getBestTradeExactOutput(toAtomic(newOutputAmount, outputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);

    const atomicInputAmount = getTradeInputAmount(bestTradeExact);
    setInputAmount(atomicInputAmount ? toReal(atomicInputAmount, inputToken) : null);
  };

  const onSwapPairChange = (newPair: SwapPair) => {
    setSwapPair(newPair);
    if (lastAmountFieldChanged === SwapField.INPUT_AMOUNT) {
      onInputAmountChange(inputAmount);
    } else {
      onOutputAmountChange(outputAmount);
    }
  };

  const updateCalculations = () => {
    if (lastAmountFieldChanged === SwapField.INPUT_AMOUNT) {
      onInputAmountChange(inputAmount);
    } else {
      onOutputAmountChange(outputAmount);
    }
  };

  return {
    atLeastOneRouteWithV3,
    bestTrade,
    dexRoute,
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount,
    outputAmount,
    resetCalculations,
    trade: bestTradeWithSlippageTolerance,
    updateCalculations
  };
};
