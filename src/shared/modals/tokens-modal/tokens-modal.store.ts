import { action, computed, makeObservable, observable } from 'mobx';

import { getTokenSlug, isExist, isNull, isTokenEqual } from '@shared/helpers';
import { RootStore } from '@shared/store';
import { ManagedToken, Token } from '@shared/types';

import { TokensModalAbort, TokensModalInitialParams } from './types';

type TokensResolver = (value: Nullable<Array<Token>> | PromiseLike<Nullable<Array<Token>>>) => void;

export class TokensModalStore {
  isOpen = false;
  _chosenTokens: Nullable<Array<Token>> = null;
  initialTokens: Nullable<Array<Token>> = null;

  get chosenTokens(): Nullable<Array<Token>> {
    return this.checkVisibilityOfChosenTokens(this._chosenTokens);
  }

  private tokensResolver: Nullable<TokensResolver> = null;

  get tokensWithChosen() {
    return this.rootStore.tokensManagerStore.filteredTokens.map(token => {
      const isTokenChosen = this.isChosenToken(token);

      return {
        ...token,
        isChosen: isTokenChosen
      };
    });
  }

  constructor(private readonly rootStore: RootStore) {
    makeObservable(this, {
      isOpen: observable,
      _chosenTokens: observable,

      setOpenState: action,
      toggleChosenToken: action,
      setChosenTokens: action,
      setInitialTokens: action,

      tokensWithChosen: computed
    });
  }

  setOpenState(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  setChosenTokens(tokens: Nullable<Array<Token>>) {
    this._chosenTokens = tokens;
  }

  setInitialTokens(tokens: Nullable<Array<Token>>) {
    this.initialTokens = tokens;
  }

  toggleChosenToken(token: ManagedToken) {
    if (!this._chosenTokens) {
      this._chosenTokens = [];
    }

    if (token.isHidden) {
      this.rootStore.tokensManagerStore.makeTokenVisible(token);
    }

    const tokens = this.isChosenToken(token)
      ? this._chosenTokens?.filter(chosenToken => getTokenSlug(chosenToken) !== getTokenSlug(token)) ?? null
      : [...this._chosenTokens, token];

    this.setChosenTokens(tokens);
  }

  close(params?: TokensModalAbort) {
    if (!isExist(this.tokensResolver)) {
      return;
    }
    this.tokensResolver(params?.abort ? this.initialTokens : this._chosenTokens);
    this.tokensResolver = null;
  }

  async open(params: TokensModalInitialParams = {}): Promise<Nullable<Array<Token>>> {
    const { tokens: initialTokens } = params;

    this.setInitialTokens(initialTokens ?? null);
    this.setChosenTokens(initialTokens ?? null);
    this.setOpenState(true);

    const tokens = await new Promise<Nullable<Array<Token>>>(resolve => {
      this.tokensResolver = resolve;
    });

    this.setOpenState(false);
    this.setChosenTokens(null);
    this.setInitialTokens(null);

    return tokens;
  }

  isChosenToken(token: Token) {
    const chosenTokensSlugs = this._chosenTokens?.map(getTokenSlug);

    return Boolean(chosenTokensSlugs?.includes(getTokenSlug(token)));
  }

  private checkVisibilityOfChosenTokens(chosenTokens: Nullable<Array<Token>>) {
    if (isNull(chosenTokens)) {
      return null;
    }

    const hiddenToken = this.rootStore.tokensManagerStore.managedTokens.find(
      managedToken => managedToken.isHidden && chosenTokens.find(chosenToken => isTokenEqual(chosenToken, managedToken))
    );

    if (!hiddenToken) {
      return chosenTokens;
    }

    this.toggleChosenToken(hiddenToken);

    return null;
  }
}