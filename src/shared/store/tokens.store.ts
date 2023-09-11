import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';

import { RootStore } from './root.store';
import { Nullable, Token } from '../types';

export type TokensMap = Map<string, Nullable<Token>>;

export class TokensStore {
  tokens: TokensMap = new Map<string, Nullable<Token>>();
  loading = false;

  get tokensList() {
    return [...this.tokens.values()].filter(isExist);
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokens: observable,
      loading: observable,

      setToken: action,
      setLoading: action
    });
  }

  setToken(tokenSlug: string, token: Nullable<Token>) {
    this.tokens.set(tokenSlug, token);
  }

  getToken(tokenSlug: Nullable<string>): Nullable<Token> {
    if (!tokenSlug) {
      return null;
    }

    return this.tokens.get(tokenSlug) ?? null;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }
}
