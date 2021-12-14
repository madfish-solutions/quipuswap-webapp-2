import BigNumber from 'bignumber.js';

import { FEE_RATE } from '@utils/defaults';
import { getTokenSlug, SwapParams } from '@utils/helpers';
import { TokenId, DexPair } from '@utils/types';

const feeDenominator = new BigNumber(1000);
const feeNumerator = feeDenominator.minus(new BigNumber(FEE_RATE).div(100).times(feeDenominator));

export const getDexPairsAfterSwap = ({ inputToken, inputAmount, dexChain }: SwapParams) => {
  let currentToken = inputToken;
  let intermediateInputAmount = inputAmount;
  const newDexChain: DexPair[] = [];
  dexChain.forEach(pair => {
    const { token1, token2, token1Pool, token2Pool } = pair;
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token1);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;

    const inputWithFee = intermediateInputAmount.times(feeNumerator);
    const numerator = inputWithFee.times(outputLiquidity);
    const denominator = inputLiquidity.times(feeDenominator).plus(inputWithFee);
    const outputAmount = numerator.idiv(denominator);
    if (outputAmount.gt(outputLiquidity.idiv(3))) {
      throw new Error('Input amount exceeds maximal one');
    }
    newDexChain.push({
      ...pair,
      token1Pool: pair.token1Pool.plus(shouldSell ? intermediateInputAmount : outputAmount.times(-1)),
      token2Pool: pair.token2Pool.plus(shouldSell ? outputAmount.times(-1) : intermediateInputAmount)
    });
    intermediateInputAmount = outputAmount;
    currentToken = shouldSell ? token2 : token1;
  });

  return newDexChain;
};

export const getTokenOutput = ({ inputToken, inputAmount, dexChain }: SwapParams) => {
  let currentToken = inputToken;
  let intermediateInputAmount = inputAmount;
  dexChain.forEach(({ token1, token2, token1Pool, token2Pool }) => {
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token1);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;

    const inputWithFee = intermediateInputAmount.times(feeNumerator);
    const numerator = inputWithFee.times(outputLiquidity);
    const denominator = inputLiquidity.times(feeDenominator).plus(inputWithFee);
    intermediateInputAmount = numerator.idiv(denominator);
    if (intermediateInputAmount.gt(outputLiquidity.idiv(3))) {
      throw new Error('Input amount exceeds maximal one');
    }
    currentToken = shouldSell ? token2 : token1;
  });

  return intermediateInputAmount;
};

export const getTokenInput = (outputToken: TokenId, outputAmount: BigNumber, dexChain: DexPair[]) => {
  let currentToken = outputToken;
  let intermediateOutputAmount = outputAmount;
  [...dexChain].reverse().forEach((pair, index) => {
    const { token1, token2, token1Pool, token2Pool } = pair;
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token2);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;
    const inputToken = shouldSell ? token1 : token2;
    if (intermediateOutputAmount.gt(outputLiquidity.idiv(3))) {
      throw new Error('Output amount exceeds maximal one');
    }
    if (!intermediateOutputAmount.eq(0)) {
      const numerator = inputLiquidity.times(feeDenominator).times(intermediateOutputAmount);
      const denominator = outputLiquidity.minus(intermediateOutputAmount).times(feeNumerator);
      intermediateOutputAmount = numerator.idiv(denominator).plus(1);
    }
    try {
      getTokenOutput({
        inputToken,
        inputAmount: intermediateOutputAmount,
        dexChain: dexChain.slice(dexChain.length - index - 1)
      });
    } catch (e) {
      intermediateOutputAmount = intermediateOutputAmount.minus(1);
    }
    currentToken = shouldSell ? token1 : token2;
  });
  try {
    getTokenOutput({
      inputToken: currentToken,
      inputAmount: intermediateOutputAmount,
      dexChain
    });
  } catch (e) {
    throw new Error('Output amount exceeds maximal one');
  }

  return intermediateOutputAmount;
};

export const getMaxTokenInput = (outputToken: TokenId, dexChain: DexPair[]) => {
  const reversedDexChain = [...dexChain].reverse();
  let intermediateMaxTokenInput = new BigNumber(Infinity);
  let intermediateOutputToken = outputToken;
  reversedDexChain.forEach(pair => {
    const { token1, token2, token1Pool, token2Pool } = pair;
    const shouldSell = getTokenSlug(intermediateOutputToken) === getTokenSlug(token2);
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;
    const maxOutput = BigNumber.min(intermediateMaxTokenInput, outputLiquidity.idiv(3));
    try {
      intermediateMaxTokenInput = getTokenInput(intermediateOutputToken, maxOutput, [pair]).minus(1);
    } catch {
      intermediateMaxTokenInput = new BigNumber(0);
    }
    intermediateOutputToken = shouldSell ? token1 : token2;
  });
  return intermediateMaxTokenInput;
};

export const getMarketQuotient = (inputToken: TokenId, dexChain: DexPair[]) => {
  let currentToken = inputToken;
  let marketQuotient = new BigNumber(1);
  dexChain.forEach(pair => {
    const { token1, token2, token1Pool, token2Pool } = pair;
    const shouldSell = getTokenSlug(token1) === getTokenSlug(currentToken);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;

    marketQuotient = marketQuotient.times(outputLiquidity).div(inputLiquidity);
    currentToken = shouldSell ? token2 : token1;
  });
  return marketQuotient;
};

export const getPriceImpact = (swapParams: SwapParams) => {
  try {
    const { inputToken, inputAmount, dexChain } = swapParams;
    const initialMarketQuotient = getMarketQuotient(inputToken, dexChain);
    const newDexChain = getDexPairsAfterSwap({ inputToken, inputAmount, dexChain });
    const newMarketQuotient = getMarketQuotient(inputToken, newDexChain);
    return (
      newMarketQuotient.gt(initialMarketQuotient)
        ? new BigNumber(1).minus(initialMarketQuotient.div(newMarketQuotient))
        : new BigNumber(1).minus(newMarketQuotient.div(initialMarketQuotient))
    ).times(100);
  } catch (e) {
    return new BigNumber(99.9);
  }
};
