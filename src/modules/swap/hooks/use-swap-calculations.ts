import { useEffect, useMemo, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import {
  DexTypeEnum,
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade,
  TradeOperation,
  useAllRoutePairs
} from 'swap-router-sdk';

import { UnsupportedDexType } from '@shared/errors/unsupported-dex-type.error';
import { fromDecimals, toDecimals } from '@shared/helpers';
import { useTokens, useTokensStore } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { TokensMap } from '@shared/store/tokens.store';
import { BooleanMap, DexPair, DexPairType, Optional, Token } from '@shared/types';

import { KNOWN_DEX_TYPES, TEZOS_DEXES_API_URL } from '../config';
import { useRoutePairsCombinations, useTradeWithSlippageTolerance } from '../utils/swap-router-sdk-adapters';
import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken: Optional<Token>;
  outputToken: Optional<Token>;
}

const mapDexType = (dexType: DexTypeEnum): DexPairType => {
  switch (dexType) {
    case DexTypeEnum.QuipuSwap:
      return DexPairType.TokenToXtz;
    case DexTypeEnum.QuipuSwapTokenToTokenDex:
      return DexPairType.TokenToToken;
    default:
      throw new UnsupportedDexType();
  }
};

const DEFAULT_DEX_ID = 0;

const mapTradeToDexPair = (operation: TradeOperation, token1: Token, token2: Token): DexPair => {
  const { aTokenPool, bTokenPool, dexType, dexAddress, dexId } = operation;

  const dex = {
    token1Pool: aTokenPool,
    token2Pool: bTokenPool,
    token1,
    token2
  };

  const type = mapDexType(dexType);

  const id = type === DexPairType.TokenToXtz ? dexAddress : dexId?.toNumber?.() ?? DEFAULT_DEX_ID;

  return {
    ...dex,
    id,
    type
  } as DexPair;
};

const mapTradeToDexPairs = (trade: Nullable<Trade>, tokens: TokensMap): DexPair[] =>
  trade
    ? trade.map(operation => {
        const token1 = tokens.get(operation.aTokenSlug);
        const token2 = tokens.get(operation.bTokenSlug);
        if (!token1) {
          throw new Error(`No Token Metadata of ${token1}`);
        }
        if (!token2) {
          throw new Error(`No Token Metadata of ${token2}`);
        }

        return mapTradeToDexPair(operation, token1, token2);
      })
    : [];

const getTokenSlugsFromTrade = (trade: Nullable<Trade>): string[] => {
  if (!trade) {
    return [];
  }

  const tokens: BooleanMap = trade.reduce((acc, { aTokenSlug, bTokenSlug }) => {
    acc[aTokenSlug] = true;
    acc[bTokenSlug] = true;

    return acc;
  }, {} as BooleanMap);

  return Object.keys(tokens);
};

export const useSwapCalculations = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const { tokens } = useTokensStore();
  const {
    settings: { tradingSlippage }
  } = useSettingsStore();

  const [dexRoute, setDexRoute] = useState<DexPair[]>([]);
  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>(null);

  const tokensSlugs = getTokenSlugsFromTrade(bestTrade);
  useTokens(tokensSlugs);

  useEffect(() => {
    try {
      setDexRoute(mapTradeToDexPairs(bestTrade, tokens));
    } catch (_) {
      setDexRoute([]);
    }
  }, [bestTrade, tokens]);

  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({ inputToken: null, outputToken: null });
  const [inputAmount, setInputAmount] = useState<Nullable<BigNumber>>(null);
  const [outputAmount, setOutputAmount] = useState<Nullable<BigNumber>>(null);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);

  const routePairsCombinations = useRoutePairsCombinations(inputToken, outputToken, filteredRoutePairs);
  const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
    inputAmount && toDecimals(inputAmount, inputToken),
    bestTrade,
    tradingSlippage
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

    const bestTradeExact = getBestTradeExactInput(toDecimals(newInputAmount, inputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);

    const rawOutput = getTradeOutputAmount(bestTradeExact);
    setOutputAmount(rawOutput ? fromDecimals(rawOutput, outputToken) : null);
  };

  const onOutputAmountChange = (newOutputAmount: Nullable<BigNumber>) => {
    setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);
    if (!newOutputAmount || !routePairsCombinations.length) {
      return resetCalculations();
    }
    setOutputAmount(newOutputAmount);

    const bestTradeExact = getBestTradeExactOutput(toDecimals(newOutputAmount, outputToken), routePairsCombinations);
    setBestTrade(bestTradeExact);

    const rawInput = getTradeInputAmount(bestTradeExact);
    setInputAmount(rawInput ? fromDecimals(rawInput, inputToken) : null);
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
    resetCalculations,
    trade: bestTradeWithSlippageTolerance
  };
};
