import { action, makeObservable, observable } from 'mobx';

import { Token } from '../types';
import { RootStore } from './root.store';

export class TokensStore {
  tokens: { [key: string]: Nullable<Token> } = {};

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokens: observable,

      setToken: action
    });
  }

  setToken(tokenSlug: string, token: Nullable<Token>) {
    this.tokens[tokenSlug] = token;
  }

  getToken(tokenSlug: string): Nullable<Token> {
    return this.tokens[tokenSlug];
  }
}
