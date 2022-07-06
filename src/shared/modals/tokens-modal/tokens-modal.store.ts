import { action, makeObservable, observable } from 'mobx';

import { getTokenSlug, isExist } from '@shared/helpers';
import { RootStore } from '@shared/store';
import { Token } from '@shared/types';

type TokensResolver = (value: Nullable<Array<Token>> | PromiseLike<Nullable<Array<Token>>>) => void;

export class TokensModalStore {
  isOpen = true;
  chosenTokens: Nullable<Array<Token>> = null;

  private tokensResolver: Nullable<TokensResolver> = null;

  constructor(private readonly store: RootStore) {
    makeObservable(this, {
      isOpen: observable,
      chosenTokens: observable,

      setOpenState: action,
      toggleChosenToken: action
    });
  }

  setOpenState(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  private setChosenTokens(tokens: Nullable<Array<Token>>) {
    this.chosenTokens = tokens;
  }

  toggleChosenToken(token: Token) {
    if (this.isChosenToken(token)) {
      if (!this.chosenTokens) {
        this.chosenTokens = [];
      }
      this.setChosenTokens([...this.chosenTokens, token]);
    } else {
      this.setChosenTokens(
        this.chosenTokens?.filter(chosenToken => getTokenSlug(chosenToken) !== getTokenSlug(token)) ?? null
      );
    }
  }

  close() {
    if (isExist(this.tokensResolver)) {
      this.tokensResolver(this.chosenTokens);
      this.tokensResolver = null;
    }
  }

  async open(chosenTokens: Nullable<Array<Token>> = null): Promise<Nullable<Array<Token>>> {
    this.setChosenTokens(chosenTokens);
    this.setOpenState(true);

    const tokens = await new Promise<Nullable<Array<Token>>>(resolve => {
      this.tokensResolver = resolve;
    });

    this.setOpenState(false);
    this.setChosenTokens(null);

    return tokens;
  }

  isChosenToken(token: Token) {
    const chosenTokensSlugs = this.chosenTokens?.map(getTokenSlug);

    return Boolean(chosenTokensSlugs?.includes(getTokenSlug(token)));
  }
}
