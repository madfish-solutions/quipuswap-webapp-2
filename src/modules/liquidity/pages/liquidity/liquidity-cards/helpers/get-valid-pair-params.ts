import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Standard, Token } from '@shared/types';

export const getValidPairParams = (
  dex: FoundDex,
  tokenA: Token,
  tokenB: Token,
  tokenAInput: BigNumber,
  tokenBInput: BigNumber
) => {
  const validTokenAType = tokenA.type === Standard.Fa12 ? 'fa12' : 'fa2';
  const validTokenBType = tokenB.type === Standard.Fa12 ? 'fa12' : 'fa2';

  if (tokenA.type === Standard.Fa12 && tokenA.type === tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      validTokenBType,
      tokenB.contractAddress,
      tokenAInput,
      tokenBInput
    );
  }

  if (tokenA.type === Standard.Fa2 && tokenA.type === tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      tokenA.fa2TokenId,
      validTokenBType,
      tokenB.contractAddress,
      tokenB.fa2TokenId,
      tokenAInput,
      tokenBInput
    );
  }

  if (tokenA.type === Standard.Fa12 && tokenA.type !== tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      validTokenBType,
      tokenB.contractAddress,
      tokenB.fa2TokenId,
      tokenAInput,
      tokenBInput
    );
  }

  if (tokenA.type === Standard.Fa2 && tokenA.type !== tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      tokenA.fa2TokenId,
      validTokenBType,
      tokenB.contractAddress,
      tokenAInput,
      tokenBInput
    );
  }

  return null;
};
