import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { getTokenSlug, getTokenSymbol } from '@shared/helpers';
import { AmountToken } from '@shared/types';

export const getNewLiquidityCreatePoolData = (
  tezos: TezosToolkit,
  dexTwoContract: string,
  tokensAndAmounts: Array<AmountToken>,
  tokensExchangeRates: Array<BigNumber>,
  candidate: string,
  accountPkh: string,
  transactionDeadline: BigNumber,
  liquiditySlippage: BigNumber
) => {
  const [tokenAmountA, tokenAmountB] = tokensAndAmounts;
  const [tokenAExchangeRate, tokenBExchangeRate] = tokensExchangeRates;

  return {
    tezos,
    contractAddress: dexTwoContract,
    tokenASlug: getTokenSlug(tokenAmountA.token),
    tokenBSlug: getTokenSlug(tokenAmountB.token),
    tokenASymbol: getTokenSymbol(tokenAmountA.token),
    tokenBSymbol: getTokenSymbol(tokenAmountB.token),
    tokenAInput: tokenAmountA.token,
    tokenBInput: tokenAmountB.token,
    tokenAAmount: tokenAmountA.amount,
    tokenBAmount: tokenAmountB.amount,
    tokenAInUsd: tokenAExchangeRate ?? 'testnet',
    tokenBInUsd: tokenBExchangeRate ?? 'testnet',
    poolCreator: accountPkh,
    baker: candidate,
    transactionDeadline: Number(transactionDeadline.toFixed()),
    liquiditySlippage: Number(liquiditySlippage.toFixed())
  };
};
