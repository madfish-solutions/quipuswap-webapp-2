import { useMemo, useState } from 'react';

import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';
import { BigNumber } from 'bignumber.js';

import {
  getBestTradeExactInput,
  getBestTradeExactOutput,
  getTradeInputAmount,
  getTradeOutputAmount,
  Trade,
  useAllRoutePairs,
  useRoutePairsCombinations
} from '../../../libs/swap-router-sdk';
import { KNOWN_DEX_TYPES, TEZOS_DEXES_API_URL } from '../config';
import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken?: Token;
  outputToken?: Token;
}

export const useSwapCalculationsV2 = () => {
  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);
  const filteredRoutePairs = useMemo(
    () => allRoutePairs.data.filter(routePair => KNOWN_DEX_TYPES.includes(routePair.dexType)),
    [allRoutePairs.data]
  );

  const [bestTrade, setBestTrade] = useState<Nullable<Trade>>();

  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({});
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
    bestTrade,
    onInputAmountChange,
    onOutputAmountChange,
    onSwapPairChange,
    inputAmount,
    outputAmount,
    resetCalculations
  };
};
