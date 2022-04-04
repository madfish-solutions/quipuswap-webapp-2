import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { SECONDS_IN_MINUTE } from '@config/constants';
import { batchOperations } from '@shared/dapp';
import { getBlockchainTimestamp, toDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { increaseBySlippage, getTokensResetAndUpdateOperators } from '../../helpers';

export const addLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  id: BigNumber,
  tokenAInput: string,
  tokenA: Token,
  tokenB: Token,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber,
  transactionDuration: BigNumber,
  slippagePercentage: BigNumber
) => {
  const transactionDurationInSeconds = transactionDuration
    .multipliedBy(SECONDS_IN_MINUTE)
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();
  const transactionDeadline = (await getBlockchainTimestamp(tezos, transactionDurationInSeconds)).toString();

  const { address: dexAddress } = dex.contract;
  const { decimals: decimalsA } = tokenA.metadata;

  const tokenABN = new BigNumber(tokenAInput);
  const tokenAAmount = toDecimals(tokenABN, decimalsA);

  const shares = tokenAAmount.multipliedBy(totalSupply).idiv(tokenAPool);
  const tokenBAmount = shares.multipliedBy(tokenBPool).div(totalSupply).integerValue(BigNumber.ROUND_UP);

  const withDecimalsA = increaseBySlippage(tokenAAmount, slippagePercentage).integerValue(BigNumber.ROUND_DOWN);
  const withDecimalsB = increaseBySlippage(tokenBAmount, slippagePercentage).integerValue(BigNumber.ROUND_DOWN);

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(tezos, tokenA, tokenB, dexAddress, accountPkh, tokenAAmount, tokenBAmount);
  const investParams = dex.contract.methods.invest(id, shares, withDecimalsA, withDecimalsB, transactionDeadline);

  return await (
    await batchOperations(tezos, [
      tokenAResetOperator,
      tokenBResetOperator,
      tokenAUpdateOperator,
      tokenBUpdateOperator,
      investParams
    ])
  ).send();
};
