import { action, makeObservable, observable } from 'mobx';

import { isExist } from '@shared/helpers';

import { Token } from '../types';
import { RootStore } from './root.store';

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

  getToken(tokenSlug: string): Nullable<Token> {
    return this.tokens.get(tokenSlug) ?? null;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }
}
