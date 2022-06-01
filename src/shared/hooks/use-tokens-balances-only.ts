import { BigNumber } from 'bignumber.js';

import { Optional, Token } from '@shared/types';

import { useTokensWithBalances } from './use-tokens-with-balances';

export const useTokensBalancesOnly = (tokens: Optional<Array<Token>>): Array<Nullable<BigNumber>> => {
  const tokensWithBalances = useTokensWithBalances(tokens);

  return tokensWithBalances.map(({ balance }) => balance ?? null);
};
