import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { WhitelistedToken } from '@utils/types';

export const getValidPairParams = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  tokenAInput: BigNumber,
  tokenBInput: BigNumber
) => {
  const validTokenAType = tokenA.type === Standard.Fa12 ? Standard.Fa12 : Standard.Fa2;
  const validTokenBType = tokenB.type === Standard.Fa12 ? Standard.Fa12 : Standard.Fa2;

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
