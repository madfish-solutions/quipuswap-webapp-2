import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { SECONDS_IN_MINUTE } from '@config/constants';
import { batchOperations } from '@shared/dapp';
import { getBlockchainTimestamp, increaseBySlippage, toDecimals } from '@shared/helpers';
import { Token } from '@shared/types';

import { getTokensResetAndUpdateOperators } from '../../helpers';

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

  const tokenAAmount = new BigNumber(tokenAInput);

  const shares = tokenAAmount.multipliedBy(totalSupply).dividedToIntegerBy(tokenAPool);
  const tokenBAmount = shares.multipliedBy(tokenBPool).dividedBy(totalSupply);
  const aTokemAtom = toDecimals(tokenAAmount, tokenA);
  const bTokemAtom = toDecimals(tokenAAmount, tokenB);

  const withSlippageA = increaseBySlippage(aTokemAtom, slippagePercentage);
  const withSlippageB = increaseBySlippage(bTokemAtom, slippagePercentage);

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(tezos, tokenA, tokenB, dexAddress, accountPkh, tokenAAmount, tokenBAmount);
  const investParams = dex.contract.methods.invest(id, shares, withSlippageA, withSlippageB, transactionDeadline);

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
