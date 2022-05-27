import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { fromDecimals, getRandomId, isEmptyArray, isExist, isTokenEqual } from '@shared/helpers';

import { Optional, Token } from '../types';
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

      setBalance: action,
      subscribe: action,
      unsubscribe: action,
      clearBalances: action
    });
  }

  setBalance(token: Token, balance: Nullable<BigNumber>) {
    const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
    if (!tokenBalance) {
      return;
    }
    tokenBalance.balance = balance ? fromDecimals(balance, token) : null;
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

  getBalance(token: Optional<Token>) {
    if (isExist(token)) {
      const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));

      return tokenBalance?.balance;
    }
  }

  clearBalances() {
    this.tokensBalances.forEach(tokenBalance => {
      tokenBalance.balance = null;
    });
  }

  async loadTokenBalance(token: Token) {
    if (this.rootStore.authStore.accountPkh && this.rootStore.tezos) {
      const balance = await getUserTokenBalance(this.rootStore.tezos, this.rootStore.authStore.accountPkh, token);
      this.setBalance(token, balance);
    }
  }

  async loadBalances() {
    if (!this.rootStore.authStore.accountPkh || !this.rootStore.tezos) {
      this.clearBalances();

      return null;
    }

    return await Promise.all(this.tokensBalances.map(async ({ token }) => this.loadTokenBalance(token)));
  }
}
