import { useState } from 'react';

import { BigNumber } from 'bignumber.js';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade
} from 'swap-router-sdk';

import { toReal, toAtomic, getUniqArray, isEmptyArray, isExist, canUseThreeRouteApi } from '@shared/helpers';
import { useTokensLoader } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable, Optional, Token } from '@shared/types';

import { threeRouteTokenMatches } from '../helpers';
import { useRoutePairs } from '../providers/route-pairs-provider';
import {
  swapRouterSdkTokenSlugToQuipuTokenSlug,
  useRoutePairsCombinations,
  useTradeWithSlippageTolerance
} from '../utils/swap-router-sdk-adapters';
import { SwapAmountFieldName, SwapField } from '../utils/types';
import { useSwapStore } from './use-swap-store';

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

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSwapCalculations = () => {
  const { routePairs } = useRoutePairs();

  const {
    settings: { tradingSlippage }
  } = useSettingsStore();
  const swapStore = useSwapStore();

  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>(null);

  const tokensSlugs = getTokenSlugsFromTrade(bestTrade);
  useTokensLoader(tokensSlugs);

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
    swapStore.threeRouteSwapStore.resetData();
  };

  const onInputAmountChange = async (newInputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);

    if (!newInputAmount || isEmptyArray(routePairsCombinations)) {
      return resetCalculations(newInputAmount, null);
    }

    setInputAmount(newInputAmount);

    if (canUseThreeRouteApi()) {
      try {
        const [threeRouteInputToken, threeRouteOutputToken] = [inputToken, outputToken].map(
          token =>
            token && swapStore.threeRouteTokens.find(threeRouteToken => threeRouteTokenMatches(threeRouteToken, token))
        );

        if (threeRouteInputToken && threeRouteOutputToken) {
          swapStore.inputTokenSymbol = threeRouteInputToken.symbol;
          swapStore.outputTokenSymbol = threeRouteOutputToken.symbol;
          swapStore.realAmount = newInputAmount;
          await swapStore.threeRouteSwapStore.load();
          setOutputAmount(isEmptyArray(swapStore.threeRouteSwap.chains) ? null : swapStore.threeRouteSwap.output);
          setBestTrade([]);

          return;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    const bestTradeExact = getBestTradeExactInput(toAtomic(newInputAmount, inputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);
    swapStore.threeRouteSwapStore.resetData();

    const atomicOutputAmount = getTradeOutputAmount(bestTradeExact);
    setOutputAmount(atomicOutputAmount ? toReal(atomicOutputAmount, outputToken) : null);
  };

  const onOutputAmountChange = (newOutputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);

    if (!newOutputAmount || isEmptyArray(routePairsCombinations)) {
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
    noMediatorsTrade: bestTrade,
    threeRouteSwap: isEmptyArray(swapStore.threeRouteSwap.chains) ? null : swapStore.threeRouteSwap,
    isLoading: swapStore.threeRouteSwapIsLoading,
    // TODO: change logic as soon as UI for multiple routes is implemented
    dexRoute: [],
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount,
    outputAmount,
    resetCalculations,
    noMediatorsTradeWithSlippage: bestTradeWithSlippageTolerance,
    updateCalculations
  };
};
