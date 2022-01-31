import { Standard } from '@graphql';
import { isExist } from '@utils/helpers';
import { SortTokensContractsType, SortType, TokenId, TokenIdFa2 } from '@utils/types';

const isTokenTypeFa2 = (token: TokenId): token is TokenIdFa2 =>
  token.type.toUpperCase() === Standard.Fa2 || ('fa2TokenId' in token && isExist(token.fa2TokenId));
const isTokenTypeFa12 = (token: TokenId) => !isTokenTypeFa2(token);

const getSort = (tokenA: TokenId, tokenB: TokenId, type: SortType): SortTokensContractsType => ({
  addressA: tokenA.contractAddress,
  idA: isTokenTypeFa2(tokenA) ? tokenA.fa2TokenId : null,
  addressB: tokenB.contractAddress,
  idB: isTokenTypeFa2(tokenB) ? tokenB.fa2TokenId : null,
  type
});

const getRevertSort = (tokenA: TokenId, tokenB: TokenId, type: SortType): SortTokensContractsType => ({
  ...getSort(tokenA, tokenB, type),
  isRevert: true
});

export const sortTokensContracts = (tokenA: TokenId, tokenB: TokenId): SortTokensContractsType => {
  if (isTokenTypeFa12(tokenA)) {
    if (isTokenTypeFa2(tokenB)) {
      return getSort(tokenA, tokenB, SortType.LeftRight);
    }

    // isTokenTypeFa12(tokenA) && isTokenTypeFa12(tokenB)
    if (tokenA.contractAddress < tokenB.contractAddress) {
      return getSort(tokenA, tokenB, SortType.LeftLeft);
    }

    return getRevertSort(tokenB, tokenA, SortType.LeftLeft);
  }

  // isTokenTypeFa2(tokenA)
  if (isTokenTypeFa12(tokenB)) {
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
