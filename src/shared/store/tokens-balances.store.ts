import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getRandomId, isEmptyArray, isTokenEqual } from '@shared/helpers';

import { Token } from '../types';
import { RootStore } from './root.store';

interface TokenBalance {
  token: Token;
  balance: Nullable<BigNumber>;
  subscriptions: string[];
}

export class TokensBalancesStore {
  tokensBalances: TokenBalance[] = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokensBalances: observable,

      subscribe: action,
      unsubscribe: action
    });
  }

  subscribe(token: Token) {
    const subscription = getRandomId();
    const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
    if (!tokenBalance) {
      this.tokensBalances.push({
        token,
        balance: null,
        subscriptions: [subscription]
      });
    } else {
      tokenBalance.subscriptions.push(subscription);
    }

    return subscription;
  }

  unsubscribe(token: Token, subscription: string) {
    const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
    if (!tokenBalance) {
      return;
    }
    tokenBalance.subscriptions = tokenBalance.subscriptions.filter(_subscription => subscription !== _subscription);
    if (isEmptyArray(tokenBalance.subscriptions)) {
      this.tokensBalances = this.tokensBalances.filter(tb => !isTokenEqual(token, tb.token));
    }
  }

  getBalance(token: Token) {
    const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
    if (!tokenBalance) {
      return undefined;
    }

    return tokenBalance.balance;
  }
}
