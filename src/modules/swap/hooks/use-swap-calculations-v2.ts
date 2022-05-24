import { useCallback, useEffect, useRef, useState } from 'react';

import { BigNumber } from 'bignumber.js';

import {
  amountsAreEqual,
  DexGraph,
  fromDecimals,
  getRouteWithInput,
  getRouteWithOutput,
  getTokenInput,
  getTokenOutput,
  getTokenSlug,
  toDecimals
} from '@shared/helpers';
import { useDexGraph } from '@shared/hooks';
import { DexPair, Token, Undefined } from '@shared/types';

import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken?: Token;
  outputToken?: Token;
}

export const useSwapCalculationsV2 = () => {
  const { dexGraph } = useDexGraph();

  const [inputAmount, setInputAmount] = useState<BigNumber>();
  const [outputAmount, setOutputAmount] = useState<BigNumber>();
  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({});
  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  // eslint-disable-next-line no-console
  console.log('1.dexRoute', dexRoute);
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);
  const prevDexGraphRef = useRef<DexGraph>();

  const onInputPrerequisitesChange = useCallback(
    (newOutputAmount: Undefined<BigNumber>, { inputToken: newInputToken, outputToken: newOutputToken }: SwapPair) => {
      if (newOutputAmount && newInputToken && newOutputToken) {
        const rawNewOutputAmount = toDecimals(newOutputAmount, newOutputToken).integerValue(BigNumber.ROUND_FLOOR);
        const route = getRouteWithOutput({
          outputAmount: rawNewOutputAmount,
          startTokenSlug: getTokenSlug(newInputToken),
          endTokenSlug: getTokenSlug(newOutputToken),
          graph: dexGraph
        });
        try {
          setInputAmount(
            route ? fromDecimals(getTokenInput(newOutputToken, rawNewOutputAmount, route), newInputToken) : undefined
          );
          setDexRoute(route);

          return;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      setDexRoute(undefined);
      setInputAmount(undefined);
    },
    [dexGraph]
  );

  const onOutputPrerequisitesChange = useCallback(
    (newInputAmount: Undefined<BigNumber>, { inputToken: newInputToken, outputToken: newOutputToken }: SwapPair) => {
      if (newInputAmount && newInputToken && newOutputToken) {
        const rawNewInputAmount = toDecimals(newInputAmount, newInputToken).integerValue(BigNumber.ROUND_FLOOR);
        const route = getRouteWithInput({
          inputAmount: rawNewInputAmount,
          startTokenSlug: getTokenSlug(newInputToken),
          endTokenSlug: getTokenSlug(newOutputToken),
          graph: dexGraph
        });
        try {
          setDexRoute(route);
          setOutputAmount(
            route
              ? fromDecimals(
                  getTokenOutput({ inputAmount: rawNewInputAmount, inputToken: newInputToken, dexChain: route }),
                  newOutputToken
                )
              : undefined
          );

          return;
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      setDexRoute(undefined);
      setOutputAmount(undefined);
    },
    [dexGraph]
  );

  const onInputAmountChange = (newInputAmount: Undefined<BigNumber>) => {
    if (!amountsAreEqual(newInputAmount, inputAmount)) {
      setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);
      setInputAmount(newInputAmount);
      onOutputPrerequisitesChange(newInputAmount, { inputToken, outputToken });
    }
  };

  const onOutputAmountChange = (newOutputAmount: Undefined<BigNumber>) => {
    if (!amountsAreEqual(newOutputAmount, outputAmount)) {
      setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);
      setOutputAmount(newOutputAmount);
      onInputPrerequisitesChange(newOutputAmount, { inputToken, outputToken });
    }
  };

  const onSwapPairChange = useCallback(
    (newPair: SwapPair) => {
      setSwapPair(newPair);
      if (lastAmountFieldChanged === SwapField.INPUT_AMOUNT) {
        onOutputPrerequisitesChange(inputAmount, newPair);
      } else {
        onInputPrerequisitesChange(outputAmount, newPair);
      }
    },
    [inputAmount, lastAmountFieldChanged, onInputPrerequisitesChange, onOutputPrerequisitesChange, outputAmount]
  );

  const resetCalculations = () => {
    setLastAmountFieldChanged(SwapField.INPUT_AMOUNT);
    setInputAmount(undefined);
    setOutputAmount(undefined);
  };

  useEffect(() => {
    if (prevDexGraphRef.current !== dexGraph) {
      onSwapPairChange({ inputToken, outputToken });
    }
    prevDexGraphRef.current = dexGraph;
  }, [dexGraph, onSwapPairChange, inputToken, outputToken]);

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
