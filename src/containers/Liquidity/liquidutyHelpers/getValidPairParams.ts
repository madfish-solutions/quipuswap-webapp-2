import { FoundDex } from '@quipuswap/sdk';
import { WhitelistedToken } from '@quipuswap/ui-kit/dist/utils/types';
import BigNumber from 'bignumber.js';

export const getValidPairParams = (
  dex:FoundDex,
  tokenA:WhitelistedToken,
  tokenB:WhitelistedToken,
  tokenAInput: BigNumber,
  tokenBInput: BigNumber,
) => {
  const validTokenAType = tokenA.type === 'fa1.2' ? 'fa12' : 'fa2';
  const validTokenBType = tokenB.type === 'fa1.2' ? 'fa12' : 'fa2';

  if (tokenA.type === 'fa1.2' && tokenA.type === tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      validTokenBType,
      tokenB.contractAddress,
      tokenAInput,
      tokenBInput,
    );
  }

  if (tokenA.type === 'fa2' && tokenA.type === tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      tokenA.fa2TokenId,
      validTokenBType,
      tokenB.contractAddress,
      tokenB.fa2TokenId,
      tokenAInput,
      tokenBInput,
    );
  }

  if (tokenA.type === 'fa1.2' && tokenA.type !== tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      validTokenBType,
      tokenB.contractAddress,
      tokenB.fa2TokenId,
      tokenAInput,
      tokenBInput,
    );
  }

  if (tokenA.type === 'fa2' && tokenA.type !== tokenB.type) {
    return dex.contract.methods.addPair(
      validTokenAType,
      tokenA.contractAddress,
      tokenA.fa2TokenId,
      validTokenBType,
      tokenB.contractAddress,
      tokenAInput,
      tokenBInput,
    );
  }

  return null;
};
