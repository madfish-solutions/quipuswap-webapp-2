import { useCallback, useEffect, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';

import { useDexGraph } from '@hooks/use-dex-graph';
import { amountsAreEqual, fromDecimals, getTokenInput, getTokenOutput, getTokenSlug, toDecimals } from '@utils/helpers';
import { DexGraph, getRouteWithInput, getRouteWithOutput } from '@utils/routing';
import { DexPair, Undefined, WhitelistedToken } from '@utils/types';

import { SwapAmountFieldName, SwapField } from '../utils/types';

interface SwapPair {
  inputToken?: WhitelistedToken;
  outputToken?: WhitelistedToken;
}

export const useSwapCalculations = () => {
  const { dexGraph } = useDexGraph();

  const [inputAmount, setInputAmount] = useState<BigNumber>();
  const [outputAmount, setOutputAmount] = useState<BigNumber>();
  const [{ inputToken, outputToken }, setSwapPair] = useState<SwapPair>({});
  const [dexRoute, setDexRoute] = useState<DexPair[]>();
  const [lastAmountFieldChanged, setLastAmountFieldChanged] = useState<SwapAmountFieldName>(SwapField.INPUT_AMOUNT);
  const prevDexGraphRef = useRef<DexGraph>();

  const onInputPrequisitesChange = useCallback(
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

  const onOutputPrequisitesChange = useCallback(
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
      onOutputPrequisitesChange(newInputAmount, { inputToken, outputToken });
    }
  };

  const onOutputAmountChange = (newOutputAmount: Undefined<BigNumber>) => {
    if (!amountsAreEqual(newOutputAmount, outputAmount)) {
      setLastAmountFieldChanged(SwapField.OUTPUT_AMOUNT);
      setOutputAmount(newOutputAmount);
      onInputPrequisitesChange(newOutputAmount, { inputToken, outputToken });
    }
  };

  const onSwapPairChange = useCallback(
    (newPair: SwapPair) => {
      setSwapPair(newPair);
      if (lastAmountFieldChanged === SwapField.INPUT_AMOUNT) {
        onOutputPrequisitesChange(inputAmount, newPair);
      } else {
        onInputPrequisitesChange(outputAmount, newPair);
      }
    },
    [inputAmount, lastAmountFieldChanged, onInputPrequisitesChange, onOutputPrequisitesChange, outputAmount]
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
