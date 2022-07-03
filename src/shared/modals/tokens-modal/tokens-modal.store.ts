import { action, makeObservable, observable } from 'mobx';

import { isNull } from '@shared/helpers';
import { RootStore } from '@shared/store';
import { Token } from '@shared/types';

type TokensResolver = (value: Array<Token> | PromiseLike<Array<Token>>) => void;

export class TokensModalStore {
  isOpen = true;

  tokensResolver: Nullable<TokensResolver> = null;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      isOpen: observable,
      tokensResolver: observable,

      setOpenState: action,
      setTokensResolver: action
    });
  }

  setTokensResolver(resolve: TokensResolver) {
    this.tokensResolver = resolve;
  }

  setOpenState(value: boolean) {
    this.isOpen = value;
  }

  setChoosenTokens(value: Array<Token>) {
    if (!isNull(this.tokensResolver)) {
      this.tokensResolver(value);
      this.tokensResolver = null;
    }
  }
}
