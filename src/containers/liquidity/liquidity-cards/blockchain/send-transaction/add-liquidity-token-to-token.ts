import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { SECONDS_IN_MINUTE } from '@app.config';
import { batchOperations } from '@utils/dapp/batch-operations';
import { getBlockchainTimestamp, toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import { getTokensResetAndUpdateOperators } from '../../helpers/get-tokens-reset-and-update-operators';

export const addLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  id: BigNumber,
  tokenAInput: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber,
  transactionDuration: BigNumber
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

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(tezos, tokenA, tokenB, dexAddress, accountPkh, tokenAAmount, tokenBAmount);
  const investParams = dex.contract.methods.invest(id, shares, tokenAAmount, tokenBAmount, transactionDeadline);

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
