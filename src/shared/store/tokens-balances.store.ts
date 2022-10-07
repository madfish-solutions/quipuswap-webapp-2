import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { getRandomId, getTokenSlug, isEmptyArray, isExist, isTokenEqual, saveBigNumber, toReal } from '@shared/helpers';

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

      setRealBalance: action,
      subscribe: action,
      unsubscribe: action,
      clearBalances: action
    });
  }

  setRealBalance(token: Token, balance: Nullable<BigNumber>) {
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      return;
    }
    tokenBalance.balance = balance ? toReal(balance, token) : null;
  }

  private async addToken(token: Token, subscription: string) {
    const newTokenBalance: TokenBalance = {
      token,
      balance: null,
      subscriptions: [subscription]
    };
    this.tokensBalances.push(newTokenBalance);
    try {
      await this.loadTokenBalance(token);
    } catch (_) {
      this.unsubscribe(token, subscription);
    }
  }

  subscribe(token: Token) {
    const subscription = getRandomId();
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      void this.addToken(token, subscription);
    } else {
      tokenBalance.subscriptions.push(subscription);
    }

    return subscription;
  }

  unsubscribe(token: Token, subscription: string) {
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      return;
    }
    tokenBalance.subscriptions = tokenBalance.subscriptions.filter(_subscription => subscription !== _subscription);
    if (isEmptyArray(tokenBalance.subscriptions)) {
      this.tokensBalances = this.tokensBalances.filter(tb => !isTokenEqual(token, tb.token));
    }
  }

  getTokenBalance(token: Token) {
    return this.tokensBalances.find(tb => isTokenEqual(token, tb.token));
  }

  getBalance(token: Optional<Token>) {
    if (!isExist(token)) {
      return null;
    }

    const tokenBalance = this.getTokenBalance(token);

    return tokenBalance?.balance ?? null;
  }

  clearBalances() {
    this.tokensBalances.forEach(tokenBalance => {
      tokenBalance.balance = null;
    });
  }

  async loadTokenBalance(token: Optional<Token>, force?: boolean) {
    if (!this.rootStore.authStore.accountPkh || !this.rootStore.tezos || !token) {
      return null;
    }

    const tokenBalance = this.getTokenBalance(token);

    if ((!tokenBalance && !force) || (tokenBalance?.balance && !force)) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log('load.balance', getTokenSlug(token), force);
    const balance = await getUserTokenBalance(this.rootStore.tezos, this.rootStore.authStore.accountPkh, token);
    this.setRealBalance(token, saveBigNumber(balance, new BigNumber('0')));
  }

  async loadBalances() {
    if (!this.rootStore.authStore.accountPkh || !this.rootStore.tezos) {
      this.clearBalances();

      return null;
    }
    // eslint-disable-next-line no-console
    console.log('loadBalances.all', this.tokensBalances.length);

    return await Promise.all(this.tokensBalances.map(async ({ token }) => this.loadTokenBalance(token, true)));
  }
}
