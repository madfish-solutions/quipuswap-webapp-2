import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import {
  getRandomId,
  getTokenSlug,
  isBigNumberGreaterZero,
  isEmptyArray,
  isExist,
  isTokenEqual,
  saveBigNumber,
  toReal
} from '@shared/helpers';

import { TokensBalancesLSApi } from '../api';
import { Nullable, Optional, Token, TokenId } from '../types';
import { RootStore } from './root.store';

export interface TokenBalance {
  token: Token;
  balance: Nullable<BigNumber>;
  exchangeRate: Nullable<BigNumber>;
  dollarEquivalent: Nullable<BigNumber>;
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

  getTokenBalance(token: TokenId) {
    return this.tokensBalances.find(tb => isTokenEqual(token, tb.token)) ?? null;
  }

  setRealBalance(token: Token, balance: Nullable<BigNumber>) {
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      return;
    }
    tokenBalance.balance = balance ? toReal(balance, token) : null;
    if (isBigNumberGreaterZero(tokenBalance.balance)) {
      // Save token data to LocalStorage
      TokensBalancesLSApi.saveTokenUsage(getTokenSlug(token));
    }
  }

  setDollarEquivalent(token: Token, exchangeRate: Nullable<BigNumber>, dollarEquivalent: Nullable<BigNumber>) {
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      return;
    }
    tokenBalance.exchangeRate = exchangeRate;
    tokenBalance.dollarEquivalent = dollarEquivalent;
    if (isBigNumberGreaterZero(dollarEquivalent)) {
      // Save token data to LocalStorage
      TokensBalancesLSApi.setTokenBalance(getTokenSlug(token), dollarEquivalent.toNumber());
    }
  }

  subscribe(token: Token) {
    const subscription = getRandomId();
    const tokenBalance = this.getTokenBalance(token);
    if (!tokenBalance) {
      this.tokensBalances.push({
        token,
        balance: null,
        exchangeRate: null,
        dollarEquivalent: null,
        subscriptions: [subscription]
      });
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
  }

  getBalance(token: Optional<Token>) {
    if (isExist(token)) {
      const tokenBalance = this.getTokenBalance(token);

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
      this.setRealBalance(token, saveBigNumber(balance, new BigNumber('0')));
    }
  }

  async loadBalances() {
    if (!this.rootStore.authStore.accountPkh || !this.rootStore.tezos) {
      this.clearBalances();

      return null;
    }

    return await Promise.all(
      this.tokensBalances
        .filter(({ subscriptions }) => !isEmptyArray(subscriptions))
        .map(async ({ token }) => this.loadTokenBalance(token))
    );
  }
}
