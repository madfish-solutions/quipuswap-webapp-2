/* eslint-disable sonarjs/no-duplicate-string */
import { Standard } from '@graphql';
import { Token } from '@utils/types';

export const sortTokensPair = (
  tokenA: Token,
  tokenB: Token
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

  if (tokenA.type === Standard.Fa12 && tokenA.type === tokenB.type) {
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

  if (tokenA.type === Standard.Fa2 && tokenA.type === tokenB.type) {
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

  throw new Error('Impossible to sort tokens');
};
