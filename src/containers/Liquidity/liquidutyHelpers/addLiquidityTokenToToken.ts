import BigNumber from 'bignumber.js';
import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { WhitelistedToken } from '@utils/types';

import { updateOperator } from './updateOperator';
import { getValidPairParams } from './getValidPairParams';

export const addLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  accountPkh: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  tokenAInput: string,
  tokenBInput: string,
) => {
  const ten = new BigNumber(10);
  const tokenADecimals = ten.pow(tokenA.metadata.decimals);
  const tokenBDecimals = ten.pow(tokenB.metadata.decimals);

  const fixedTokenAInput = new BigNumber(tokenAInput).multipliedBy(tokenADecimals);
  const fixedTokenBInput = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);

  const tokenAUpdateOperator = await updateOperator(
    tezos,
    tokenA,
    dex.contract.address,
    fixedTokenAInput,
    accountPkh,
  );
  if (!tokenAUpdateOperator) return;
  const tokenBUpdateOperator = await updateOperator(
    tezos,
    tokenB,
    dex.contract.address,
    fixedTokenBInput,
    accountPkh,
  );
  if (!tokenBUpdateOperator) return;

  const validAppPairParams = getValidPairParams(
    dex,
    tokenA,
    tokenB,
    fixedTokenAInput,
    fixedTokenBInput,
  );

  if (!validAppPairParams) return;

  const batch = await tezos.wallet.batch()
    .withContractCall(tokenAUpdateOperator)
    .withContractCall(tokenBUpdateOperator)
    .withContractCall(validAppPairParams);

  await batch.send();
};
