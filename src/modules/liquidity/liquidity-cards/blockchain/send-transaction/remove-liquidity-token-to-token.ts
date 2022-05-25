import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS, SECONDS_IN_MINUTE } from '@config/constants';
import { decreaseBySlippage, getBlockchainTimestamp, toDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { getOrderedTokensAmounts } from '../../helpers';

export const removeLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  id: BigNumber,
  lpTokenInput: string,
  tokenAOutput: string,
  tokenBOutput: string,
  tokenA: Token,
  tokenB: Token,
  transactionDuration: BigNumber,
  slippagePercentage: BigNumber
) => {
  const transactionDurationInSeconds = transactionDuration
    .multipliedBy(SECONDS_IN_MINUTE)
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();
  const transactionDeadline = (await getBlockchainTimestamp(tezos, transactionDurationInSeconds)).toString();

  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const lpTokenBN = new BigNumber(lpTokenInput);
  const tokenAOutputBN = new BigNumber(tokenAOutput);
  const tokenBOutputBN = new BigNumber(tokenBOutput);

  const shares = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);

  const withSlippageA = decreaseBySlippage(tokenAOutputBN, decimalsA, slippagePercentage);
  const withSlippageB = decreaseBySlippage(tokenBOutputBN, decimalsB, slippagePercentage);

  const { orderedAmountA, orderedAmountB } = getOrderedTokensAmounts(tokenA, tokenB, withSlippageA, withSlippageB);

  return dex.contract.methods.divest(id, orderedAmountA, orderedAmountB, shares, transactionDeadline).send();
};
