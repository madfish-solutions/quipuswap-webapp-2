import { batchify } from '@quipuswap/sdk';
import { OpKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {
  getWalletContract,
  makeAddOperatorsTransferMethod,
  getAllowanceTransferParams,
  makeRemoveOperatorsTransferMethod
} from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { getTokenSlug } from '@utils/helpers';
import { TokenId, DexPair } from '@utils/types';

import { getTokenOutput } from './tokenToTokenDex';

export type SwapParams = {
  inputToken: TokenId;
  inputAmount: BigNumber;
  dexChain: DexPair[];
  slippageTolerance?: BigNumber;
  ttDexAddress?: string;
  recipient?: string;
};

type SwapStepParams = {
  operation: { a_to_b: {} } | { b_to_a: {} };
  pair_id: number;
};

const serialPromiseAll = <T extends unknown[], U>(
  data: T[],
  promiseFactory: (index: number, ...args: T) => Promise<U>,
  initialIndex = 0
) => {
  const [dataItem, ...restData] = data;

  if (data.length === 0) {
    return Promise.resolve([]);
  }

  return promiseFactory(initialIndex, ...dataItem).then(
    async (result): Promise<U[]> => [result, ...(await serialPromiseAll(restData, promiseFactory, initialIndex + 1))]
  );
};

const defaultMaxDelay = 15 * 60 * 1000;
// eslint-disable-next-line sonarjs/cognitive-complexity
export const getSwapTransferParams = async (tezos: TezosToolkit, accountPkh: string, swapParams: SwapParams) => {
  const {
    inputToken,
    inputAmount,
    dexChain,
    slippageTolerance = new BigNumber(0),
    ttDexAddress,
    recipient = accountPkh
  } = swapParams;
  const ttDexContract = ttDexAddress ? await getWalletContract(tezos.wallet, ttDexAddress) : undefined;
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
        dexChain: [dexChain[i]]
      })
    );
    currentToken = shouldSellToken1 ? token2 : token1;
  }
  currentToken = inputToken;

  const addFa2Operator = (
    { type: tokenType, contractAddress: tokenAddress, fa2TokenId: tokenId }: TokenId,
    operator: string
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
  const deadline = new BigNumber(Date.now() + defaultMaxDelay).idiv(1000).toFixed();

  await serialPromiseAll(
    dexChain.map(x => [x]),
    async (index, currentDex) => {
      const { token1, token2 } = currentDex;
      const currentOperationRecipient = index === dexChain.length - 1 ? recipient : accountPkh;
      const prevDex = index === 0 ? undefined : dexChain[index - 1];
      const shouldSellToken1 = getTokenSlug(token1) === getTokenSlug(currentToken);
      const currentSlippageToleranceQuotient =
        new BigNumber(1).minus(slippageTolerance).toNumber() **
        new BigNumber(index + 1).div(dexChain.length).toNumber();
      const prevSlippageToleranceQuotient =
        new BigNumber(1).minus(slippageTolerance).toNumber() ** new BigNumber(index).div(dexChain.length).toNumber();
      let currentDexInput = noSlippageToleranceOutputs[index].times(prevSlippageToleranceQuotient).integerValue();
      if (currentDexInput.eq(0) && !noSlippageToleranceOutputs[index].eq(0)) {
        currentDexInput = new BigNumber(1);
      }
      let minOut = noSlippageToleranceOutputs[index + 1]
        .times(currentSlippageToleranceQuotient)
        .integerValue(index === dexChain.length - 1 ? BigNumber.ROUND_FLOOR : undefined);
      if (minOut.eq(0) && !noSlippageToleranceOutputs[index + 1].eq(0)) {
        minOut = new BigNumber(1);
      }

      if (prevDex?.type === 'ttdex') {
        if (currentDex.type === 'tokenxtz') {
          const tokenToXtzContract = await getWalletContract(tezos.wallet, currentDex.id);
          swapsParams.push(
            ttDexContract!.methods
              .swap(ttdexSwapStepsParams, ttdexSwapInput, currentDexInput, accountPkh, deadline)
              .toTransferParams({ storageLimit: 1000 })
          );
          ttdexSwapStepsParams = [];
          addFa2Operator(currentToken, currentDex.id);
          swapsParams.push(
            ...(await getAllowanceTransferParams(tezos, currentToken, accountPkh, currentDex.id, currentDexInput)),
            tokenToXtzContract.methods
              .tokenToTezPayment(currentDexInput, minOut, currentOperationRecipient)
              .toTransferParams()
          );
        } else {
          ttdexSwapStepsParams.push({
            operation: shouldSellToken1 ? { a_to_b: {} } : { b_to_a: {} },
            pair_id: currentDex.id
          });
        }
      } else if (currentDex.type === 'tokenxtz') {
        const tokenToXtzContract = await getWalletContract(tezos.wallet, currentDex.id);
        if (currentToken.contractAddress === TEZOS_TOKEN.contractAddress) {
          swapsParams.push(
            tokenToXtzContract.methods.tezToTokenPayment(minOut, currentOperationRecipient).toTransferParams({
              mutez: true,
              amount: currentDexInput.toNumber()
            })
          );
        } else {
          addFa2Operator(currentToken, currentDex.id);
          swapsParams.push(
            ...(await getAllowanceTransferParams(tezos, currentToken, accountPkh, currentDex.id, currentDexInput)),
            tokenToXtzContract.methods
              .tokenToTezPayment(currentDexInput, minOut, currentOperationRecipient)
              .toTransferParams()
          );
        }
      } else {
        ttdexSwapInput = currentDexInput;
        addFa2Operator(currentToken, ttDexAddress!);
        swapsParams.push(
          ...(await getAllowanceTransferParams(tezos, currentToken, accountPkh, ttDexAddress!, currentDexInput))
        );
        ttdexSwapStepsParams.push({
          operation: shouldSellToken1 ? { a_to_b: {} } : { b_to_a: {} },
          pair_id: currentDex.id
        });
      }

      currentToken = shouldSellToken1 ? token2 : token1;
    }
  );
  if (ttdexSwapStepsParams.length > 0) {
    swapsParams.push(
      ttDexContract!.methods
        .swap(
          ttdexSwapStepsParams,
          ttdexSwapInput,
          noSlippageToleranceOutputs[dexChain.length]
            .times(new BigNumber(1).minus(slippageTolerance))
            .integerValue(BigNumber.ROUND_FLOOR),
          recipient,
          deadline
        )
        .toTransferParams({ storageLimit: 1000 })
    );
    ttdexSwapStepsParams = [];
  }

  const rawOperatorsOperations = await Promise.all(
    Object.entries(fa2Operators).map(
      async ([tokenAddress, tokensIdsOperators]): Promise<[TransferParams, TransferParams]> => [
        (await makeAddOperatorsTransferMethod(tezos, accountPkh, tokenAddress, tokensIdsOperators)).toTransferParams(),
        (
          await makeRemoveOperatorsTransferMethod(tezos, accountPkh, tokenAddress, tokensIdsOperators)
        ).toTransferParams()
      ]
    )
  );
  const [addOperatorsParams, removeOperatorsParams] = rawOperatorsOperations.reduce<
    [TransferParams[], TransferParams[]]
  >(
    (acc, [addOperators, removeOperators]) => [
      [...acc[0], addOperators],
      [...acc[1], removeOperators]
    ],
    [[], []]
  );

  return [...addOperatorsParams, ...swapsParams, ...removeOperatorsParams];
};

export const swap = async (tezos: TezosToolkit, accountPkh: string, swapParams: SwapParams) => {
  const params = await getSwapTransferParams(tezos, accountPkh, swapParams);
  const batch = tezos.wallet.batch([]);
  batchify(batch, params);

  return batch.send();
};

export const estimateSwapFee = async (tezos: TezosToolkit, accountPkh: string, swapParams: SwapParams) => {
  const transferParams = await getSwapTransferParams(tezos, accountPkh, swapParams);
  const estimations = await tezos.estimate.batch(
    transferParams.map(params => ({ ...params, kind: OpKind.TRANSACTION }))
  );
  return estimations.reduce<BigNumber>(
    (
      acc,
      {
        storageLimit,
        suggestedFeeMutez,
        // @ts-ignore
        minimalFeePerStorageByteMutez
      }
    ) => acc.plus(suggestedFeeMutez).plus(storageLimit * minimalFeePerStorageByteMutez),
    new BigNumber(0)
  );
};
