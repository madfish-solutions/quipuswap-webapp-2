import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@utils/dapp/batch-operations';
import { toDecimals } from '@utils/helpers';
import { getDeadline } from '@utils/helpers/get-deadline';
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
  tokenBPool: BigNumber
) => {
  const { address: dexAddress } = dex.contract;
  const { decimals: decimalsA } = tokenA.metadata;

  const tokenABN = new BigNumber(tokenAInput);
  const tokenAAmount = toDecimals(tokenABN, decimalsA);

  const shares = tokenAAmount.multipliedBy(totalSupply).idiv(tokenAPool);
  const tokenBAmount = shares.multipliedBy(tokenBPool).div(totalSupply).integerValue(BigNumber.ROUND_UP);

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(tezos, tokenA, tokenB, dexAddress, accountPkh, tokenAAmount, tokenBAmount);
  const deadline = await getDeadline(tezos);
  const investParams = dex.contract.methods.invest(id, shares, tokenAAmount, tokenBAmount, deadline);

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
