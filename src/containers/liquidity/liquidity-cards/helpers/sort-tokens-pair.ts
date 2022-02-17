/* eslint-disable sonarjs/no-duplicate-string */
import { Standard } from '@graphql';
import { isExist } from '@utils/helpers';
import { Token } from '@utils/types';

const sortTokensWithDifferentTypes = (tokenA: Token, tokenB: Token) => {
  if (tokenA.type < tokenB.type) {
    return {
      tokenA,
      tokenB,
      type: 'Left-Right'
    };
  }

  if (tokenA.type > tokenB.type) {
    return {
      tokenA: tokenB,
      tokenB: tokenA,
      type: 'Left-Right'
    };
  }

  return null;
};
const sortFa12Tokens = (tokenA: Token, tokenB: Token) => {
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

  return null;
};

const sortFa2Tokens = (tokenA: Token, tokenB: Token) => {
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
      if (isExist(tokenA.fa2TokenId) && isExist(tokenB.fa2TokenId) && tokenA.fa2TokenId < tokenB.fa2TokenId) {
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

export const sortTokensPair = (tokenA: Token, tokenB: Token) => {
  const sortedTokensWithDifferentTypes = sortTokensWithDifferentTypes(tokenA, tokenB);
  if (sortedTokensWithDifferentTypes) {
    return sortedTokensWithDifferentTypes;
  }

  const sortedFa12Tokens = sortFa12Tokens(tokenA, tokenB);
  if (sortedFa12Tokens) {
    return sortedFa12Tokens;
  }

  const sortedFa2Tokens = sortFa2Tokens(tokenA, tokenB);
  if (sortedFa2Tokens) {
    return sortedFa2Tokens;
  }

  throw new Error('Impossible to sort tokens');
};
