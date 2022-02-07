import { isTokenFa12, isTokenFa2 } from '@utils/helpers';
import { SortTokensContractsType, SortType, TokenId } from '@utils/types';

const getSort = (tokenA: TokenId, tokenB: TokenId, type: SortType): SortTokensContractsType => ({
  addressA: tokenA.contractAddress,
  idA: isTokenFa2(tokenA) ? tokenA.fa2TokenId : null,
  addressB: tokenB.contractAddress,
  idB: isTokenFa2(tokenB) ? tokenB.fa2TokenId : null,
  type
});

const getRevertSort = (tokenA: TokenId, tokenB: TokenId, type: SortType): SortTokensContractsType => ({
  ...getSort(tokenA, tokenB, type),
  isRevert: true
});

export const sortTokensContracts = (tokenA: TokenId, tokenB: TokenId): SortTokensContractsType => {
  if (isTokenFa12(tokenA)) {
    if (isTokenFa2(tokenB)) {
      return getSort(tokenA, tokenB, SortType.LeftRight);
    }

    // isTokenTypeFa12(tokenA) && isTokenTypeFa12(tokenB)
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return getSort(tokenA, tokenB, SortType.LeftLeft);
    }

    return getRevertSort(tokenB, tokenA, SortType.LeftLeft);
  }

  // isTokenTypeFa2(tokenA)
  if (isTokenFa12(tokenB)) {
    return getRevertSort(tokenB, tokenA, SortType.LeftRight);
  }

  if (tokenA.contractAddress < tokenB.contractAddress) {
    return getSort(tokenA, tokenB, SortType.RightRight);
  }

  if (tokenA.contractAddress > tokenB.contractAddress) {
    return getRevertSort(tokenB, tokenA, SortType.RightRight);
  }

  // tokenA.contractAddress === tokenB.contractAddress
  if (tokenA.fa2TokenId! < tokenB.fa2TokenId!) {
    return getSort(tokenA, tokenB, SortType.RightRight);
  }

  return getRevertSort(tokenB, tokenA, SortType.RightRight);
};
