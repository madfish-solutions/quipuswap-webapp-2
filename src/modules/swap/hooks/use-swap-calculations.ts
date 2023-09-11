import { useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade
} from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import {
  toReal,
  toAtomic,
  getUniqArray,
  isEmptyArray,
  isExist,
  canUseThreeRouteApi,
  getTokenSlug,
  isNotDefined
} from '@shared/helpers';
import { useTokensLoader } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable, Optional, Token } from '@shared/types';

import { useSwapStore } from './use-swap-store';
import { threeRouteTokenMatches } from '../helpers';
import { useRoutePairs } from '../providers/route-pairs-provider';
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

const extractPoolTokensSlugs = (pool: RoutePair) => {
  const {
    aTokenSlug,
    aTokenStandard,
    bTokenSlug,
    bTokenStandard,
    cTokenSlug,
    cTokenStandard,
    dTokenSlug,
    dTokenStandard
  } = pool;
  const standards = [aTokenStandard, bTokenStandard, cTokenStandard, dTokenStandard];

  return [aTokenSlug, bTokenSlug, cTokenSlug, dTokenSlug]
    .filter(isExist)
    .map((slug, index) => swapRouterSdkTokenSlugToQuipuTokenSlug(slug, standards[index]));
};

const getTokenSlugsFromTrade = (trade: Nullable<Trade>) =>
  getUniqArray(trade?.map(extractPoolTokensSlugs).flat() ?? [], x => x);

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

  const [swapPair, setSwapPair] = useState<SwapPair>({ inputToken: null, outputToken: null });
  const [inputAmount, setInputAmount] = useState<Nullable<BigNumber>>(null);
  const [outputAmount, setOutputAmount] = useState<Nullable<BigNumber>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);
  const { inputToken, outputToken } = swapPair;

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
    setIsLoading(false);
  };

  const poolsForTokensArePresent = useMemo(
    () =>
      [inputToken, outputToken].every(
        token =>
          token &&
          routePairs.some(pool =>
            extractPoolTokensSlugs(pool).some(poolTokenSlug => getTokenSlug(token) === poolTokenSlug)
          )
      ),
    [inputToken, outputToken, routePairs]
  );

  const onInputAmountChange = async (newInputAmount: Nullable<BigNumber>, newSwapPair?: SwapPair) => {
    const { inputToken: newInputToken, outputToken: newOutputToken } = newSwapPair ?? swapPair;
    setIsLoading(true);
    setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);

    if (isNotDefined(newInputAmount) || newInputAmount.isZero()) {
      return resetCalculations(newInputAmount, null);
    }

    setInputAmount(newInputAmount);

    if (canUseThreeRouteApi()) {
      try {
        const [threeRouteInputToken, threeRouteOutputToken] = [newInputToken, newOutputToken].map(
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
          setIsLoading(false);

          return;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    } else if (isEmptyArray(routePairsCombinations)) {
      return resetCalculations(newInputAmount, null);
    }
    const bestTradeExact = getBestTradeExactInput(toAtomic(newInputAmount, newInputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);
    swapStore.threeRouteSwapStore.resetData();

    const atomicOutputAmount = getTradeOutputAmount(bestTradeExact);
    setOutputAmount(atomicOutputAmount ? toReal(atomicOutputAmount, newOutputToken) : null);
    setIsLoading(false);
  };

  const onOutputAmountChange = (newOutputAmount: Nullable<BigNumber>, newSwapPair?: SwapPair) => {
    const { inputToken: newInputToken, outputToken: newOutputToken } = newSwapPair ?? swapPair;
    setIsLoading(true);
    setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);

    if (!newOutputAmount || isEmptyArray(routePairsCombinations)) {
      return resetCalculations(null, newOutputAmount);
    }

    setOutputAmount(newOutputAmount);

    const bestTradeExact = getBestTradeExactOutput(toAtomic(newOutputAmount, newOutputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);

    const atomicInputAmount = getTradeInputAmount(bestTradeExact);
    setInputAmount(atomicInputAmount ? toReal(atomicInputAmount, newInputToken) : null);
    setIsLoading(false);
  };

  const onSwapPairChange = (newPair: SwapPair) => {
    setSwapPair(newPair);
    if (lastAmountFieldChanged === SwapField.INPUT_AMOUNT) {
      onInputAmountChange(inputAmount, newPair);
    } else {
      onOutputAmountChange(outputAmount, newPair);
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
    isLoading,
    // TODO: change logic as soon as UI for multiple routes is implemented
    dexRoute: [],
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount,
    outputAmount,
    resetCalculations,
    noMediatorsTradeWithSlippage: bestTradeWithSlippageTolerance,
    poolsForTokensArePresent,
    updateCalculations
  };
};
