import { useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import {
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade
} from 'swap-router-sdk';

import { toReal, isEmptyArray, toAtomic } from '@shared/helpers';
import { useTokensLoader, useTokensStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { BooleansMap, DexPair, Nullable, Optional, Token } from '@shared/types';

import { useRoutePairs } from '../providers/route-pairs-provider';
import { mapTradeToDexPairs } from '../utils/map-trade-to-dex-pairs';
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

  const tokens: BooleansMap = trade.reduce(
    (
      acc,
      { aTokenSlug: swapRouterSdkATokenSlug, aTokenStandard, bTokenSlug: swapRouterSdkBTokenSlug, bTokenStandard }
    ) => {
      const aTokenSlug = swapRouterSdkTokenSlugToQuipuTokenSlug(swapRouterSdkATokenSlug, aTokenStandard);
      const bTokenSlug = swapRouterSdkTokenSlugToQuipuTokenSlug(swapRouterSdkBTokenSlug, bTokenStandard);
      acc[aTokenSlug] = true;
      acc[bTokenSlug] = true;

      return acc;
    },
    {} as BooleansMap
  );

  return Object.keys(tokens);
};

export const useSwapCalculations = () => {
  const { routePairs } = useRoutePairs();

  const { tokens, loading: tokensLoading } = useTokensStore();
  const {
    settings: { tradingSlippage }
  } = useSettingsStore();

  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>(null);

  const tokensSlugs = getTokenSlugsFromTrade(bestTrade);
  useTokensLoader(tokensSlugs);

  useEffect(() => {
    try {
      setDexRoute(mapTradeToDexPairs(bestTrade, tokens));
    } catch {
      setDexRoute(tokensLoading && !isEmptyArray(bestTrade) ? undefined : []);
    }
  }, [tokensLoading, bestTrade, tokens, tokens.size]);

  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({ inputToken: null, outputToken: null });
  const [inputAmount, setInputAmount] = useState<Nullable<BigNumber>>(null);
  const [outputAmount, setOutputAmount] = useState<Nullable<BigNumber>>(null);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);

  const routePairsCombinations = useRoutePairsCombinations(inputToken, outputToken, routePairs);
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
