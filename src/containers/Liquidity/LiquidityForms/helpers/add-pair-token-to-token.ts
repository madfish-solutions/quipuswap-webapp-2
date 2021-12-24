import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { ZERO } from '@utils/defaults';
import { toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

import { allowContractSpendYourTokens } from './allow-contract-spend-your-tokens';
import { getValidPairParams } from './get-valid-pair-params';

export const addPairTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  tokenAInput: string,
  tokenBInput: string
) => {
  const { address: dexAddress } = dex.contract;

  const tokenABN = new BigNumber(tokenAInput);
  const tokenBBN = new BigNumber(tokenBInput);
  const tokenAAmount = toDecimals(tokenABN, tokenA);
  const tokenBAmount = toDecimals(tokenBBN, tokenB);

  const tokenAResetOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, ZERO, accountPkh);
  const tokenBResetOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, ZERO, accountPkh);
  const tokenAUpdateOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, tokenAAmount, accountPkh);
  const tokenBUpdateOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, tokenBAmount, accountPkh);

  const [tokenAResetResolved, tokenBResetResolved, tokenAUpdateResolved, tokenBUpdateResolved] = await Promise.all([
    tokenAResetOperator,
    tokenBResetOperator,
    tokenAUpdateOperator,
    tokenBUpdateOperator
  ]);

  const validAppPairParams = getValidPairParams(dex, tokenA, tokenB, tokenAAmount, tokenBAmount);

  if (!validAppPairParams) {
    return;
  }

  const batch = tezos.wallet
    .batch()
    .withContractCall(tokenAResetResolved)
    .withContractCall(tokenBResetResolved)
    .withContractCall(tokenAUpdateResolved)
    .withContractCall(tokenBUpdateResolved)
    .withContractCall(validAppPairParams);

  await batch.send();
};
