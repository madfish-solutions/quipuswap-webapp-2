import { isTokenFa12, isTokenFa2 } from '@shared/helpers';
import { AmountToken, SortType } from '@shared/types';

const getSort = (tokenA: AmountToken, tokenB: AmountToken, type: SortType) => ({
  amountA: tokenA.amount,
  amountB: tokenB.amount,
  type
});

const getRevertSort = (tokenA: AmountToken, tokenB: AmountToken, type: SortType) => ({
  ...getSort(tokenA, tokenB, type),
  isRevert: true
});

export const sortTokensAmounts = (tokensAndAmounts: AmountToken[]) => {
  const tokenA = tokensAndAmounts[0];
  const tokenB = tokensAndAmounts[1];

  if (isTokenFa12(tokenA.token)) {
    if (isTokenFa2(tokenB.token)) {
      return getSort(tokenA, tokenB, SortType.LeftRight);
    }

    // isTokenTypeFa12(tokenA) && isTokenTypeFa12(tokenB)
    if (tokenA.token.contractAddress < tokenB.token.contractAddress) {
      return getSort(tokenA, tokenB, SortType.LeftLeft);
    }

    return getRevertSort(tokenB, tokenA, SortType.LeftLeft);
  }

  // isTokenTypeFa2(tokenA)
  if (isTokenFa12(tokenB.token)) {
    return getRevertSort(tokenB, tokenA, SortType.LeftRight);
  }

  if (tokenA.token.contractAddress < tokenB.token.contractAddress) {
    return getSort(tokenA, tokenB, SortType.RightRight);
  }

  if (tokenA.token.contractAddress > tokenB.token.contractAddress) {
    return getRevertSort(tokenB, tokenA, SortType.RightRight);
  }

  // tokenA.contractAddress === tokenB.contractAddress
  if (tokenA.token.fa2TokenId! < tokenB.token.fa2TokenId!) {
    return getSort(tokenA, tokenB, SortType.RightRight);
  }

  return getRevertSort(tokenB, tokenA, SortType.RightRight);
};
