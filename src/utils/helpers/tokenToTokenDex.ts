import BigNumber from 'bignumber.js';

import { FEE_RATE } from '@utils/defaults';
import { getTokenSlug, SwapParams } from '@utils/helpers';
import { TokenId, DexPair } from '@utils/types';

const feeDenominator = new BigNumber(1000);
const feeNumerator = feeDenominator.minus(new BigNumber(FEE_RATE).div(100).times(feeDenominator));

export class InputOverflowError extends Error {
  constructor(inputAmount: BigNumber, { token1, token2 }: Pick<DexPair, 'token1' | 'token2'>) {
    const pairName = `${getTokenSlug(token1)}-${getTokenSlug(token2)}`;
    super(`Input amount (${inputAmount.toFixed()} exceeds maximal one on pair ${pairName}`);
  }
}

export class OutputOverflowError extends Error {
  constructor(outputAmount: BigNumber, { token1, token2 }: Pick<DexPair, 'token1' | 'token2'>) {
    const pairName = `${getTokenSlug(token1)}-${getTokenSlug(token2)}`;
    super(`Output amount (${outputAmount.toFixed()} exceeds maximal one on pair ${pairName}`);
  }
}

export const getDexPairsAfterSwap = ({ inputToken, inputAmount, dexChain }: SwapParams) => {
  let currentToken = inputToken;
  let intermediateInputAmount = inputAmount;
  const newDexChain: DexPair[] = [];
  dexChain.forEach(pair => {
    const { token1, token2 } = pair;
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token1);

    const outputAmount = getTokenOutput({
      inputToken: currentToken,
      inputAmount: intermediateInputAmount,
      dexChain: [pair]
    });
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
  dexChain.forEach(({ token1, token2, token1Pool, token2Pool, type }) => {
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token1);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;

    const inputWithFee = intermediateInputAmount.times(feeNumerator);
    const numerator = inputWithFee.times(outputLiquidity);
    const denominator = inputLiquidity.times(feeDenominator).plus(inputWithFee);
    const formulaOutputAmount = numerator.idiv(denominator);
    const formulaOutputAmountIsValid =
      type === 'tokenxtz' ? formulaOutputAmount.lte(outputLiquidity.idiv(3)) : !formulaOutputAmount.isNaN();

    if (formulaOutputAmountIsValid) {
      intermediateInputAmount = formulaOutputAmount;
    } else if (type === 'ttdex') {
      intermediateInputAmount = outputLiquidity.minus(1);
    } else if (intermediateInputAmount.isFinite()) {
      throw new OutputOverflowError(formulaOutputAmount, { token1, token2 });
    } else {
      throw new InputOverflowError(intermediateInputAmount, { token1, token2 });
    }

    currentToken = shouldSell ? token2 : token1;
  });

  return intermediateInputAmount;
};

export const getTokenInput = (outputToken: TokenId, outputAmount: BigNumber, dexChain: DexPair[]) => {
  let currentToken = outputToken;
  let intermediateOutputAmount = outputAmount;
  [...dexChain].reverse().forEach((pair, index) => {
    const { token1, token2, token1Pool, token2Pool, type } = pair;
    const shouldSell = getTokenSlug(currentToken) === getTokenSlug(token2);
    const inputLiquidity = shouldSell ? token1Pool : token2Pool;
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;
    const inputToken = shouldSell ? token1 : token2;
    const maxOutputAmount = type === 'ttdex' ? outputLiquidity.minus(1) : outputLiquidity.idiv(3);
    if (intermediateOutputAmount.gt(maxOutputAmount)) {
      throw new OutputOverflowError(intermediateOutputAmount, { token1, token2 });
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

  return intermediateOutputAmount;
};

export const getMaxTokenInput = (outputToken: TokenId, dexChain: DexPair[]) => {
  const reversedDexChain = [...dexChain].reverse();
  let intermediateMaxTokenInput = new BigNumber(Infinity);
  let intermediateOutputToken = outputToken;
  reversedDexChain.forEach(pair => {
    const { token1, token2, token1Pool, token2Pool, type } = pair;
    const shouldSell = getTokenSlug(intermediateOutputToken) === getTokenSlug(token2);
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;

    if (type === 'ttdex' && intermediateMaxTokenInput.gte(outputLiquidity.minus(1))) {
      intermediateMaxTokenInput = new BigNumber(Infinity);
    } else {
      const maxOutput = BigNumber.min(
        intermediateMaxTokenInput,
        type === 'ttdex' ? outputLiquidity.minus(1) : outputLiquidity.idiv(3)
      );
      try {
        intermediateMaxTokenInput = getTokenInput(intermediateOutputToken, maxOutput, [pair]).minus(1);
      } catch {
        intermediateMaxTokenInput = new BigNumber(0);
      }
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

const FALLBACK_PRICE_IMPACT = 99.9;
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
    return new BigNumber(FALLBACK_PRICE_IMPACT);
  }
};
