/* eslint-disable sonarjs/no-duplicate-string */
import { Standard } from '@graphql';
import { SortTokensContractsType, WhitelistedToken } from '@utils/types';

export const sortTokensContracts = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken
  // eslint-disable-next-line sonarjs/cognitive-complexity
): SortTokensContractsType => {
  if (tokenA.type < tokenB.type) {
    return {
      addressA: tokenA.contractAddress,
      addressB: tokenB.contractAddress,
      type: 'Left-Right'
    };
  }

  if (tokenB.type < tokenA.type) {
    return {
      addressA: tokenB.contractAddress,
      addressB: tokenA.contractAddress,
      type: 'Left-Right'
    };
  }

  if (tokenA.type === Standard.Fa12 && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        addressB: tokenB.contractAddress,
        type: 'Left-Left'
      };
    }

    return {
      addressA: tokenB.contractAddress,
      addressB: tokenA.contractAddress,
      type: 'Left-Left'
    };
  }

  if (tokenA.type === Standard.Fa2 && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        addressB: tokenB.contractAddress,
        type: 'Right-Right'
      };
    }

    if (tokenA.contractAddress > tokenB.contractAddress) {
      return {
        addressA: tokenB.contractAddress,
        addressB: tokenA.contractAddress,
        type: 'Right-Right'
      };
    }

    if (tokenA.contractAddress === tokenB.contractAddress) {
      if (tokenA.fa2TokenId && tokenB.fa2TokenId && tokenA.fa2TokenId < tokenB.fa2TokenId) {
        return {
          addressA: tokenA.contractAddress,
          addressB: tokenB.contractAddress,
          type: 'Right-Right'
        };
      }

      return {
        addressA: tokenB.contractAddress,
        addressB: tokenA.contractAddress,
        type: 'Right-Right'
      };
    }
  }

  throw new Error('Impossible to sort tokens');
};
