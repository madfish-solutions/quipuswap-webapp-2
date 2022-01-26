import BigNumber from 'bignumber.js';

export const getBalanceByTokenSlug = (tokenSlug: string | undefined, balances: Record<string, BigNumber>) => {
  if (tokenSlug === undefined) {
    return undefined;
  }

  return balances[tokenSlug];
};
