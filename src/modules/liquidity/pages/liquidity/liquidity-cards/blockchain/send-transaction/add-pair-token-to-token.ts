import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { batchOperations } from '@shared/dapp';
import { toAtomic } from '@shared/helpers';
import { Token } from '@shared/types';

import { getValidPairParams, getTokensResetAndUpdateOperators } from '../../helpers';

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
  const atomicTokenAInputAmount = toAtomic(tokenABN, tokenA);
  const atomicTokenBInputAmount = toAtomic(tokenBBN, tokenB);

  const [tokenAUpdateOperator, tokenBUpdateOperator, tokenAResetOperator, tokenBResetOperator] =
    await getTokensResetAndUpdateOperators(
      tezos,
      tokenA,
      tokenB,
      dexAddress,
      accountPkh,
      atomicTokenAInputAmount,
      atomicTokenBInputAmount
    );

  const validAddPairParams = getValidPairParams(dex, tokenA, tokenB, atomicTokenAInputAmount, atomicTokenBInputAmount);

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
