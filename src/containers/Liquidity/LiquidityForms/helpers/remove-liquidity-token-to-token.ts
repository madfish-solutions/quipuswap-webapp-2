import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { sortTokensContracts } from '@containers/Liquidity/LiquidityForms/helpers/sort-tokens-contracts';
import { LP_TOKEN_DECIMALS } from '@utils/defaults';
import { getDeadline, toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const removeLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  id: BigNumber,
  lpTokenInput: string,
  tokenAOutput: string,
  tokenBOutput: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
) => {
  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const lpTokenBN = new BigNumber(lpTokenInput);
  const tokenAOutputBN = new BigNumber(tokenAOutput);
  const tokenBOutputBN = new BigNumber(tokenBOutput);

  const shares = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);
  const tokenAOutputAmount = toDecimals(tokenAOutputBN, decimalsA);
  const tokenBOutputAmount = toDecimals(tokenBOutputBN, decimalsB);

  const deadline = await getDeadline(tezos);

  const addresses = sortTokensContracts(tokenA, tokenB);
  if (!addresses) {
    return;
  }

  if (addresses.addressA === tokenA.contractAddress) {
    return dex.contract.methods.divest(id, tokenAOutputAmount, tokenBOutputAmount, shares, deadline).send();
  }

  return dex.contract.methods.divest(id, tokenBOutputAmount, tokenAOutputAmount, shares, deadline).send();
};
