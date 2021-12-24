import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { TEN, ZERO } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

import { allowContractSpendYourTokens } from './allow-contract-spend-your-tokens';
import { getValidPairParams } from './get-valid-pair-params';

export const addPairT2T = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  tokenAInput: string,
  tokenBInput: string
) => {
  const ten = new BigNumber(TEN);
  const tokenADecimals = ten.pow(tokenA.metadata.decimals);
  const tokenBDecimals = ten.pow(tokenB.metadata.decimals);

  const fixedTokenAInput = new BigNumber(tokenAInput).multipliedBy(tokenADecimals);
  const fixedTokenBInput = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);

  const tokenAResetOperator = allowContractSpendYourTokens(tezos, tokenA, dex.contract.address, ZERO, accountPkh);
  const tokenBResetOperator = allowContractSpendYourTokens(tezos, tokenB, dex.contract.address, ZERO, accountPkh);

  const tokenAUpdateOperator = allowContractSpendYourTokens(
    tezos,
    tokenA,
    dex.contract.address,
    fixedTokenAInput,
    accountPkh
  );

  const tokenBUpdateOperator = allowContractSpendYourTokens(
    tezos,
    tokenB,
    dex.contract.address,
    fixedTokenBInput,
    accountPkh
  );

  const [tokenAResetResolved, tokenBResetResolved, tokenAUpdateResolved, tokenBUpdateResolved] = await Promise.all([
    tokenAResetOperator,
    tokenBResetOperator,
    tokenAUpdateOperator,
    tokenBUpdateOperator
  ]);

  const validAppPairParams = getValidPairParams(dex, tokenA, tokenB, fixedTokenAInput, fixedTokenBInput);

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
