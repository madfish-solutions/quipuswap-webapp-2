import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { fromDecimals, getRandomId, isEmptyArray, isTokenEqual } from '@shared/helpers';

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

  getBalance(token: Token) {
    const tokenBalance = this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
    if (!tokenBalance) {
      return undefined;
    }

    return tokenBalance.balance;
  }

  clearBalances() {
    this.tokensBalances.forEach(tokenBalance => {
      tokenBalance.balance = null;
    });
  }

  async loadTokenBalance(tezos: TezosToolkit, accountPkh: string, token: Token) {
    const balance = await getUserTokenBalance(tezos, accountPkh, token);
    this.setBalance(token, balance);
  }

  async loadBalances(tezos: Nullable<TezosToolkit>, accountPkh: Nullable<string>) {
    if (!tezos || !accountPkh) {
      this.clearBalances();

      return null;
    }

    return await Promise.all(
      this.tokensBalances.map(async ({ token }) => this.loadTokenBalance(tezos, accountPkh, token))
    );
  }
}
