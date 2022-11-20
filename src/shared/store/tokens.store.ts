import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';

import { Nullable, Token } from '../types';
import { RootStore } from './root.store';

export type TokensMap = Map<string, Nullable<Token>>;

export class TokensStore {
  tokens: TokensMap = new Map<string, Nullable<Token>>();
  loading = false;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokens: observable,
      loading: observable,

      setToken: action,
      setLoading: action
    });
  }

  get tokensList() {
    return [...this.tokens.values()].filter(isExist);
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
