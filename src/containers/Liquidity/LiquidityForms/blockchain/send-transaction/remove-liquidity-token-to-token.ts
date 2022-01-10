import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { sortTokensContracts } from '@containers/Liquidity/LiquidityForms/helpers/sort-tokens-contracts';
import { getDeadline, toDecimals } from '@utils/helpers';
import { Undefined, WhitelistedToken } from '@utils/types';

export const removeLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  id: BigNumber,
  lpTokenInput: string,
  tokenAOutput: string,
  tokenBOutput: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  transactionDuration: Undefined<BigNumber>
) => {
  const { decimals: decimalsA } = tokenA.metadata;
  const { decimals: decimalsB } = tokenB.metadata;

  const lpTokenBN = new BigNumber(lpTokenInput);
  const tokenAOutputBN = new BigNumber(tokenAOutput);
  const tokenBOutputBN = new BigNumber(tokenBOutput);

  const shares = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);
  const tokenAOutputAmount = toDecimals(tokenAOutputBN, decimalsA);
  const tokenBOutputAmount = toDecimals(tokenBOutputBN, decimalsB);

  const transactionDeadline = await getDeadline(tezos, transactionDuration);

  const addresses = sortTokensContracts(tokenA, tokenB);
  if (!addresses) {
    return;
  }

  const isTokenAAddressesTheSame = addresses.addressA === tokenA.contractAddress;

  const validTokenAAmount = isTokenAAddressesTheSame ? tokenAOutputAmount : tokenBOutputAmount;
  const validTokenBAmount = isTokenAAddressesTheSame ? tokenBOutputAmount : tokenAOutputAmount;

  return dex.contract.methods.divest(id, validTokenAAmount, validTokenBAmount, shares, transactionDeadline).send();
};
