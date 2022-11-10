import { TOKENS_BALANCES_KEY, TOKENS_EVER_HAD_KEY } from '@config/localstorage';
import { BooleansMap, NumbersMap } from '@shared/types';

import { isExist } from '../../helpers';

export namespace TokensBalancesLSApi {
  const getTokensBalances = () => {
    return JSON.parse(localStorage.getItem(TOKENS_BALANCES_KEY) ?? '{}') as NumbersMap;
  };

  const saveTokensBalances = (balances: NumbersMap) => {
    localStorage.setItem(TOKENS_BALANCES_KEY, JSON.stringify(balances));
  };

  const getTokensEverHad = () => {
    return JSON.parse(localStorage.getItem(TOKENS_EVER_HAD_KEY) ?? '{}') as BooleansMap;
  };

  const saveTokensEverHad = (tokens: BooleansMap) => {
    localStorage.setItem(TOKENS_EVER_HAD_KEY, JSON.stringify(tokens));
  };

  const saveTokenUsage = (tokenSlug: string) => {
    const everHad = getTokensEverHad();
    if (!everHad[tokenSlug]) {
      everHad[tokenSlug] = true;
      saveTokensEverHad(everHad);
    }
  };

  export const setTokenBalance = (tokenSlug: string, amount: Nullable<number>) => {
    const balances = getTokensBalances();
    if (amount) {
      balances[tokenSlug] = amount;
    } else {
      delete balances[tokenSlug];
    }
    saveTokensBalances(balances);
    if (isExist(amount)) {
      saveTokenUsage(tokenSlug);
    }
  };
}
