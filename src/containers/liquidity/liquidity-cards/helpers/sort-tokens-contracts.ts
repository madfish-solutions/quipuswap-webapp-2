/* eslint-disable sonarjs/no-duplicate-string */
import { Standard } from '@graphql';
import { SortTokensContractsType, TokenId, TokenIdFa2 } from '@utils/types';

const isTokenTypeFa12 = (token: TokenId) => token.type === Standard.Fa12;
const isTokenTypeFa2 = (token: TokenId): token is TokenIdFa2 => token.type === Standard.Fa2;

export const sortTokensContracts = (
  tokenA: TokenId,
  tokenB: TokenId
  // eslint-disable-next-line sonarjs/cognitive-complexity
): SortTokensContractsType => {
  if (isTokenTypeFa12(tokenA) && isTokenTypeFa2(tokenB)) {
    return {
      addressA: tokenA.contractAddress,
      idA: null,
      addressB: tokenB.contractAddress,
      idB: tokenB.fa2TokenId,
      type: 'Left-Right'
    };
  }

  if (isTokenTypeFa2(tokenA) && isTokenTypeFa12(tokenB)) {
    return {
      addressA: tokenB.contractAddress,
      idA: null,
      addressB: tokenA.contractAddress,
      idB: tokenA.fa2TokenId,
      type: 'Left-Right',
      isRevert: true
    };
  }

  if (isTokenTypeFa12(tokenA) && isTokenTypeFa12(tokenB)) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        idA: null,
        addressB: tokenB.contractAddress,
        idB: null,
        type: 'Left-Left'
      };
    }

    return {
      addressA: tokenB.contractAddress,
      idA: null,
      addressB: tokenA.contractAddress,
      idB: null,
      type: 'Left-Left',
      isRevert: true
    };
  }

  if (isTokenTypeFa2(tokenA) && isTokenTypeFa2(tokenB)) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        idA: tokenA.fa2TokenId,
        addressB: tokenB.contractAddress,
        idB: tokenB.fa2TokenId,
        type: 'Right-Right'
      };
    }

    if (tokenA.contractAddress > tokenB.contractAddress) {
      return {
        addressA: tokenB.contractAddress,
        idA: tokenB.fa2TokenId,
        addressB: tokenA.contractAddress,
        idB: tokenA.fa2TokenId,
        type: 'Right-Right',
        isRevert: true
      };
    }

    if (tokenA.contractAddress === tokenB.contractAddress) {
      if (tokenA.fa2TokenId < tokenB.fa2TokenId) {
        return {
          addressA: tokenA.contractAddress,
          idA: tokenA.fa2TokenId,
          addressB: tokenB.contractAddress,
          idB: tokenB.fa2TokenId,
          type: 'Right-Right'
        };
      }

      return {
        addressA: tokenB.contractAddress,
        idA: tokenB.fa2TokenId,
        addressB: tokenA.contractAddress,
        idB: tokenA.fa2TokenId,
        type: 'Right-Right',
        isRevert: true
      };
    }
  }

  throw new Error('Impossible to sort tokens');
};
