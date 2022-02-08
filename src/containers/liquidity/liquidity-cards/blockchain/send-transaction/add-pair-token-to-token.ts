import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@utils/dapp/batch-operations';
import { toDecimals } from '@utils/helpers';
import { Token } from '@utils/types';

import { getTokensResetAndUpdateOperators } from '../../helpers/get-tokens-reset-and-update-operators';
import { getValidPairParams } from '../../helpers/get-valid-pair-params';

export const addPairTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  tokenA: Token,
  tokenB: Token,
  tokenAInput: string,
  tokenBInput: string
) => {
  const { address: dexAddress } = dex.contract;

  const tokenABN = new BigNumber(tokenAInput);
  const tokenBBN = new BigNumber(tokenBInput);
  const tokenAAmount = toDecimals(tokenABN, tokenA);
  const tokenBAmount = toDecimals(tokenBBN, tokenB);

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(tezos, tokenA, tokenB, dexAddress, accountPkh, tokenAAmount, tokenBAmount);

  const validAddPairParams = getValidPairParams(dex, tokenA, tokenB, tokenAAmount, tokenBAmount);

  if (!validAddPairParams) {
    return;
  }

  return await (
    await batchOperations(tezos, [
      tokenAResetOperator,
      tokenBResetOperator,
      tokenAUpdateOperator,
      tokenBUpdateOperator,
      validAddPairParams,
      tokenAResetOperator,
      tokenBResetOperator
    ])
  ).send();
};
