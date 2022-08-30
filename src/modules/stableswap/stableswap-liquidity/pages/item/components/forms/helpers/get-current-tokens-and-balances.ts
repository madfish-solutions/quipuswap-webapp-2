import { isEmptyArray, isExist } from '@shared/helpers';
import { BalanceToken } from '@shared/types';

export const getCurrentTokensAndBalances = (
  itemBalances: BalanceToken[],
  choosedBalances: Array<Nullable<BalanceToken>>
): Array<BalanceToken> => {
  if (isEmptyArray(choosedBalances)) {
    return itemBalances;
  }

  return itemBalances.map((item, index) =>
    isExist(choosedBalances[index]) ? choosedBalances[index] : item
  ) as BalanceToken[];
};
