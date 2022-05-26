import { useEffect, useMemo, useState } from 'react';

import { getTokenSlug } from '@shared/helpers';
import { useTokens } from '@shared/hooks';
import { DexPair, DexPairType, Token } from '@shared/types';
import { BigNumber } from 'bignumber.js';

import {
  DexTypeEnum,
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade,
  TradeOperation,
  useAllRoutePairs,
  useRoutePairsCombinations
} from '../../../libs/swap-router-sdk';
import { RoutePair } from '../../../libs/swap-router-sdk/interface/route-pair.interface';
import { KNOWN_DEX_TYPES, TEZOS_DEXES_API_URL } from '../config';
import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken: Nullable<Token>;
  outputToken: Nullable<Token>;
}

const mapDexType = (dexType: DexTypeEnum): DexPairType => {
  switch (dexType) {
    case DexTypeEnum.QuipuSwap:
      return DexPairType.TokenToXtz;
    case DexTypeEnum.QuipuSwapTokenToTokenDex:
      return DexPairType.TokenToToken;
    default:
      throw new Error('Unsupported dex type');
  }
};

export const getDexSlug = ({ dexAddress, dexId }: RoutePair) =>
  dexId ? `${dexAddress}_${dexId.toFixed()}` : dexAddress;

const mapTradeToDexPair = (operation: TradeOperation): DexPair => {
  const { aTokenPool, bTokenPool, dexType } = operation;

  return {
    token1Pool: aTokenPool,
    token2Pool: bTokenPool,
    // @ts-ignore
    token1: null, // Token
    // @ts-ignore
    token2: null, // Token
    id: getDexSlug(operation),
    type: mapDexType(dexType)
  };
};

const mapTradeToDexPairs = (trade: Nullable<Trade>): DexPair[] => (trade ? trade.map(mapTradeToDexPair) : []);

const getTokenSlugsFromRoutePair = (pairs: RoutePair[]) => {
  const tokens: { [key: string]: boolean } = {};
  pairs.forEach(({ aTokenSlug, bTokenSlug }) => {
    tokens[aTokenSlug] = true;
    tokens[bTokenSlug] = true;
  });

  return Object.keys(tokens);
};

export const useSwapCalculationsV2 = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const tokensSlugs = getTokenSlugsFromRoutePair(filteredRoutePairs);
  useTokens(tokensSlugs);

  const [dexRoute, setDexRoute] = useState<DexPair[]>([]);
  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>(null);

  useEffect(() => {
    setDexRoute(mapTradeToDexPairs(bestTrade));
  }, [bestTrade]);

  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({ inputToken: null, outputToken: null });
  const [inputAmount, setInputAmount] = useState<Nullable<BigNumber>>(null);
  const [outputAmount, setOutputAmount] = useState<Nullable<BigNumber>>(null);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);

  const routePairsCombinations = useRoutePairsCombinations(
    inputToken ? getTokenSlug(inputToken) : undefined,
    outputToken ? getTokenSlug(outputToken) : undefined,
    filteredRoutePairs
  );

  const resetCalculations = () => {
    setInputAmount(null);
    setOutputAmount(null);
    setBestTrade(null);
  };

  const onInputAmountChange = (newInputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);
    if (!newInputAmount || !routePairsCombinations.length) {
      return resetCalculations();
    }
    setInputAmount(newInputAmount);

    const bestTradeExact = getBestTradeExactInput(newInputAmount, routePairsCombinations);
    setBestTrade(bestTradeExact);

    const output = getTradeOutputAmount(bestTradeExact) ?? null;
    setOutputAmount(output);
  };

  const onOutputAmountChange = (newOutputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);
    if (!newOutputAmount || !routePairsCombinations.length) {
      return resetCalculations();
    }
    setOutputAmount(newOutputAmount);

    const bestTradeExact = getBestTradeExactOutput(newOutputAmount, routePairsCombinations);
    setBestTrade(bestTradeExact);

    const output = getTradeInputAmount(bestTradeExact) ?? null;
    setOutputAmount(output);
  };

  const onSwapPairChange = (newPair: SwapPair) => {
    setSwapPair(newPair);
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
    resetCalculations
  };
};
