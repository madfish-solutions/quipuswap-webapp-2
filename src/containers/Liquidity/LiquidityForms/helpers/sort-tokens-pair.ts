/* eslint-disable sonarjs/no-duplicate-string */
import { WhitelistedToken } from '@utils/types';

export const sortTokensPair = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (tokenA.type < tokenB.type) {
    return {
      tokenA,
      tokenB,
      type: 'Left-Right'
    };
  }

  if (tokenB.type < tokenA.type) {
    return {
      tokenA: tokenB,
      tokenB: tokenA,
      type: 'Left-Right'
    };
  }

  if (tokenA.type === 'fa1.2' && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        tokenA,
        tokenB,
        type: 'Left-Left'
      };
    }

    return {
      tokenA: tokenB,
      tokenB: tokenA,
      type: 'Left-Left'
    };
  }

  if (tokenA.type === 'fa2' && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        tokenA,
        tokenB,
        type: 'Right-Right'
      };
    }

    if (tokenA.contractAddress > tokenB.contractAddress) {
      return {
        tokenA: tokenB,
        tokenB: tokenA,
        type: 'Right-Right'
      };
    }

    if (tokenA.contractAddress === tokenB.contractAddress) {
      if (tokenA.fa2TokenId && tokenB.fa2TokenId && tokenA.fa2TokenId < tokenB.fa2TokenId) {
        return {
          tokenA,
          tokenB,
          type: 'Right-Right'
        };
      }

      return {
        tokenA: tokenB,
        tokenB: tokenA,
        type: 'Right-Right'
      };
    }
  }

  return null;
};
