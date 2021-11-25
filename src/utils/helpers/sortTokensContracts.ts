import { SortTokensContractsType, WhitelistedToken } from '@utils/types';

export const sortTokensContracts = (
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
): SortTokensContractsType | null => {
  if (tokenA.type < tokenB.type) {
    return {
      addressA: tokenA.contractAddress,
      addressB: tokenB.contractAddress,
      type: 'Left-Right',
    };
  }

  if (tokenA.type === 'fa1.2' && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        addressB: tokenB.contractAddress,
        type: 'Left-Left',
      };
    }

    return {
      addressA: tokenB.contractAddress,
      addressB: tokenA.contractAddress,
      type: 'Left-Left',
    };
  }

  if (tokenA.type === 'fa2' && tokenA.type === tokenB.type) {
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return {
        addressA: tokenA.contractAddress,
        addressB: tokenB.contractAddress,
        type: 'Right-Right',
      };
    }

    if (tokenA.contractAddress > tokenB.contractAddress) {
      return {
        addressA: tokenB.contractAddress,
        addressB: tokenA.contractAddress,
        type: 'Right-Right',
      };
    }

    if (tokenA.contractAddress === tokenB.contractAddress) {
      if (tokenA.fa2TokenId && tokenB.fa2TokenId && tokenA.fa2TokenId < tokenB.fa2TokenId) {
        return {
          addressA: tokenA.contractAddress,
          addressB: tokenB.contractAddress,
          type: 'Right-Right',
        };
      }

      return {
        addressA: tokenB.contractAddress,
        addressB: tokenA.contractAddress,
        type: 'Right-Right',
      };
    }
  }

  return null;
};
