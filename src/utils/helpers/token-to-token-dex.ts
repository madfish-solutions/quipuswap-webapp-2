import { batchify } from '@quipuswap/sdk';
import { OpKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TokenId, DexPair } from '@utils/types';
import { getTokenSlug } from '@utils/helpers';
import { FEE_RATE, TEZOS_TOKEN } from '@utils/defaults';
import { getAllowance } from '@utils/dapp';

const feeDenominator = new BigNumber(1000);
const feeNumerator = feeDenominator.minus(new BigNumber(FEE_RATE).div(100).times(feeDenominator));

type SwapStepParams = {
  operation: { a_to_b: {} } | { b_to_a: {} };
  pair_id: number;
};

export type SwapParams = {
  inputToken: TokenId;
  inputAmount: BigNumber;
  dexChain: DexPair[];
  slippageTolerance?: BigNumber;
  ttDexAddress?: string;
  recipient?: string;
};

export const getDexPairsAfterSwap = ({
  inputToken,
  inputAmount,
  dexChain,
}: SwapParams) => {
  let currentToken = inputToken;
  let intermediateInputAmount = inputAmount;
  const newDexChain: DexPair[] = [];
  dexChain.forEach((pair) => {
    const {
      token1,
      token2,
      token1Pool,
      token2Pool,
    } = pair;
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
      token1Pool: pair.token1Pool.plus(
        shouldSell ? intermediateInputAmount : outputAmount.times(-1),
      ),
      token2Pool: pair.token2Pool.plus(
        shouldSell ? outputAmount.times(-1) : intermediateInputAmount,
      ),
    });
    intermediateInputAmount = outputAmount;
    currentToken = shouldSell ? token2 : token1;
  });

  return newDexChain;
};

export const getTokenOutput = ({
  inputToken,
  inputAmount,
  dexChain,
}: SwapParams) => {
  let currentToken = inputToken;
  let intermediateInputAmount = inputAmount;
  dexChain.forEach(({
    token1,
    token2,
    token1Pool,
    token2Pool,
  }) => {
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

export const getTokenInput = (
  outputToken: TokenId,
  outputAmount: BigNumber,
  dexChain: DexPair[],
) => {
  let currentToken = outputToken;
  let intermediateOutputAmount = outputAmount;
  [...dexChain].reverse().forEach((pair, index) => {
    const {
      token1,
      token2,
      token1Pool,
      token2Pool,
    } = pair;
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
        dexChain: dexChain.slice(dexChain.length - index - 1),
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
      dexChain,
    });
  } catch (e) {
    throw new Error('Output amount exceeds maximal one');
  }

  return intermediateOutputAmount;
};

export const getMaxTokenInput = (
  outputToken: TokenId,
  dexChain: DexPair[],
) => {
  const reversedDexChain = [...dexChain].reverse();
  let intermediateMaxTokenInput = new BigNumber(Infinity);
  let intermediateOutputToken = outputToken;
  reversedDexChain.forEach((pair) => {
    const {
      token1,
      token2,
      token1Pool,
      token2Pool,
    } = pair;
    const shouldSell = getTokenSlug(intermediateOutputToken) === getTokenSlug(token2);
    const outputLiquidity = shouldSell ? token2Pool : token1Pool;
    const maxOutput = BigNumber.min(intermediateMaxTokenInput, outputLiquidity.idiv(3));
    try {
      intermediateMaxTokenInput = getTokenInput(intermediateOutputToken, maxOutput, [pair])
        .minus(1);
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
  dexChain.forEach((pair) => {
    const {
      token1,
      token2,
      token1Pool,
      token2Pool,
    } = pair;
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
    const {
      inputToken,
      inputAmount,
      dexChain,
    } = swapParams;
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

const serialPromiseAll = <T extends unknown[], U>(
  data: T[],
  promiseFactory: (index: number, ...args: T) => Promise<U>,
  initialIndex = 0,
) => {
  const [dataItem, ...restData] = data;

  if (data.length === 0) {
    return Promise.resolve([]);
  }

  return promiseFactory(initialIndex, ...dataItem).then(
    async (result): Promise<U[]> => [
      result,
      ...(await serialPromiseAll(restData, promiseFactory, initialIndex + 1)),
    ],
  );
};

const makeAllowanceTransfersParams = async (
  tezos: TezosToolkit,
  token: TokenId,
  accountPkh: string,
  spender: string,
  amount: BigNumber,
) => {
  if (token.type === 'fa2' || token.contractAddress === TEZOS_TOKEN.contractAddress) {
    return [];
  }
  const tokenContract = await tezos.wallet.at(token.contractAddress);
  const allowance = await getAllowance(tezos, token.contractAddress, accountPkh, spender);
  const setAllowanceTransferParams = tokenContract
    .methods.approve(spender, amount).toTransferParams();
  if (allowance.gt(0)) {
    return [
      tokenContract.methods.approve(spender, 0).toTransferParams(),
      setAllowanceTransferParams,
    ];
  }
  return [setAllowanceTransferParams];
};

export const getSwapTransferParams = async (
  tezos: TezosToolkit,
  accountPkh: string,
  swapParams: SwapParams,
) => {
  const {
    inputToken,
    inputAmount,
    dexChain,
    slippageTolerance = new BigNumber(0),
    ttDexAddress,
    recipient = accountPkh,
  } = swapParams;
  const ttDexContract = ttDexAddress ? (await tezos.wallet.at(ttDexAddress)) : undefined;
  let currentToken = inputToken;
  const swapsParams: TransferParams[] = [];
  let ttdexSwapStepsParams: SwapStepParams[] = [];
  let ttdexSwapInput = new BigNumber(0);
  const fa2Operators: Record<string, Record<number, string[]>> = {};
  const noSlippageToleranceOutputs: BigNumber[] = [inputAmount];
  for (let i = 0; i < dexChain.length; i++) {
    const { token1, token2 } = dexChain[i];
    const shouldSellToken1 = getTokenSlug(token1) === getTokenSlug(currentToken);
    noSlippageToleranceOutputs.push(
      getTokenOutput({
        inputToken: currentToken,
        inputAmount: noSlippageToleranceOutputs[i],
        dexChain: [dexChain[i]],
      }),
    );
    currentToken = shouldSellToken1 ? token2 : token1;
  }
  currentToken = inputToken;
  console.log(noSlippageToleranceOutputs.map((x) => x.toFixed()));

  const addFa2Operator = (
    {
      type: tokenType,
      contractAddress: tokenAddress,
      fa2TokenId: tokenId,
    }: TokenId,
    operator: string,
  ) => {
    if (tokenType !== 'fa2') {
      return;
    }
    if (!fa2Operators[tokenAddress]) {
      fa2Operators[tokenAddress] = {};
    }
    if (!fa2Operators[tokenAddress][tokenId!]) {
      fa2Operators[tokenAddress][tokenId!] = [];
    }
    fa2Operators[tokenAddress][tokenId!].push(operator);
  };

  await serialPromiseAll(
    dexChain.map((x) => [x]),
    async (index, currentDex) => {
      const { token1, token2, id } = currentDex;
      const currentOperationRecipient = index === dexChain.length - 1 ? recipient : accountPkh;
      const prevDexId = index === 0 ? undefined : dexChain[index - 1].id;
      const shouldSellToken1 = getTokenSlug(token1) === getTokenSlug(currentToken);
      const currentSlippageToleranceQuotient = (
        new BigNumber(1).minus(slippageTolerance).toNumber()
      ) ** (new BigNumber(index + 1).div(dexChain.length).toNumber());
      const prevSlippageToleranceQuotient = (
        new BigNumber(1).minus(slippageTolerance).toNumber()
      ) ** (new BigNumber(index).div(dexChain.length).toNumber());
      const currentDexInput = noSlippageToleranceOutputs[index]
        .times(prevSlippageToleranceQuotient)
        .integerValue(BigNumber.ROUND_FLOOR);
      const minOut = noSlippageToleranceOutputs[index + 1]
        .times(currentSlippageToleranceQuotient)
        .integerValue(BigNumber.ROUND_FLOOR);
      console.log(
        index,
        prevSlippageToleranceQuotient.toString(),
        currentSlippageToleranceQuotient.toString(),
        currentDexInput.toFixed(),
        minOut.toFixed(),
      );

      if (typeof prevDexId === 'number') {
        if (typeof id === 'string') {
          const tokenToXtzContract = await tezos.wallet.at(id);
          swapsParams.push(
            ttDexContract!.methods.swap(
              ttdexSwapStepsParams,
              ttdexSwapInput,
              minOut,
              accountPkh,
            ).toTransferParams({ storageLimit: 1000 }),
          );
          ttdexSwapStepsParams = [];
          addFa2Operator(currentToken, id);
          swapsParams.push(
            ...(await makeAllowanceTransfersParams(
              tezos,
              currentToken,
              accountPkh,
              ttDexAddress!,
              currentDexInput,
            )),
            tokenToXtzContract.methods.tokenToTezPayment(
              currentDexInput,
              minOut,
              currentOperationRecipient,
            ).toTransferParams(),
          );
        } else {
          ttdexSwapStepsParams.push({
            operation: shouldSellToken1 ? { a_to_b: {} } : { b_to_a: {} },
            pair_id: id,
          });
        }
      } else if (typeof id === 'string') {
        const tokenToXtzContract = await tezos.wallet.at(id);
        if (currentToken.contractAddress === TEZOS_TOKEN.contractAddress) {
          swapsParams.push(
            tokenToXtzContract.methods.tezToTokenPayment(
              minOut,
              currentOperationRecipient,
            ).toTransferParams({
              mutez: true,
              amount: currentDexInput.toNumber(),
            }),
          );
        } else {
          addFa2Operator(currentToken, id);
          swapsParams.push(
            ...(await makeAllowanceTransfersParams(
              tezos,
              currentToken,
              accountPkh,
              id,
              currentDexInput,
            )),
            tokenToXtzContract.methods.tokenToTezPayment(
              currentDexInput,
              minOut,
              currentOperationRecipient,
            ).toTransferParams(),
          );
        }
      } else {
        ttdexSwapInput = currentDexInput;
        addFa2Operator(currentToken, ttDexAddress!);
        swapsParams.push(
          ...(await makeAllowanceTransfersParams(
            tezos,
            currentToken,
            accountPkh,
            ttDexAddress!,
            currentDexInput,
          )),
        );
        ttdexSwapStepsParams.push({
          operation: shouldSellToken1 ? { a_to_b: {} } : { b_to_a: {} },
          pair_id: id,
        });
      }

      currentToken = shouldSellToken1 ? token2 : token1;
    },
  );
  if (ttdexSwapStepsParams.length > 0) {
    swapsParams.push(
      ttDexContract!.methods.swap(
        ttdexSwapStepsParams,
        ttdexSwapInput,
        noSlippageToleranceOutputs[dexChain.length]
          .times(new BigNumber(1).minus(slippageTolerance))
          .integerValue(BigNumber.ROUND_FLOOR),
        recipient,
      ).toTransferParams({ storageLimit: 1000 }),
    );
    ttdexSwapStepsParams = [];
  }

  const rawOperatorsOperations = await Promise.all(
    Object.entries(fa2Operators).map(
      async ([tokenAddress, tokensIdsOperators]): Promise<[TransferParams, TransferParams]> => {
        const tokenContract = await tezos.wallet.at(tokenAddress);

        return [
          tokenContract.methods.update_operators(
            Object.entries(tokensIdsOperators).map(
              ([tokenId, operators]) => operators.map(
                (operator) => ({
                  add_operator: {
                    owner: accountPkh,
                    operator,
                    token_id: +tokenId,
                  },
                }),
              ),
            ).flat(),
          ).toTransferParams(),
          tokenContract.methods.update_operators(
            Object.entries(tokensIdsOperators).map(
              ([tokenId, operators]) => operators.map(
                (operator) => ({
                  remove_operator: {
                    owner: accountPkh,
                    operator,
                    token_id: +tokenId,
                  },
                }),
              ),
            ).flat(),
          ).toTransferParams(),
        ];
      },
    ),
  );
  const [addOperatorsParams, removeOperatorsParams] = rawOperatorsOperations
    .reduce<[TransferParams[], TransferParams[]]>(
    (acc, [addOperators, removeOperators]) => [
      [
        ...acc[0],
        addOperators,
      ],
      [
        ...acc[1],
        removeOperators,
      ],
    ],
    [[], []],
  );

  return [...addOperatorsParams, ...swapsParams, ...removeOperatorsParams];
};

export const swap = async (
  tezos: TezosToolkit,
  accountPkh: string,
  swapParams: SwapParams,
) => {
  const params = await getSwapTransferParams(tezos, accountPkh, swapParams);
  const batch = tezos.wallet.batch([]);
  batchify(batch, params);

  return batch.send();
};

export const estimateSwapFee = async (
  tezos: TezosToolkit,
  accountPkh: string,
  swapParams: SwapParams,
) => {
  const transferParams = await getSwapTransferParams(tezos, accountPkh, swapParams);
  const estimations = await tezos.estimate.batch(
    transferParams.map((params) => ({ ...params, kind: OpKind.TRANSACTION })),
  );
  return estimations.reduce<BigNumber>(
    (
      acc,
      {
        storageLimit,
        suggestedFeeMutez,
        // @ts-ignore
        minimalFeePerStorageByteMutez,
      },
    ) => acc.plus(suggestedFeeMutez).plus(storageLimit * minimalFeePerStorageByteMutez),
    new BigNumber(0),
  );
};
