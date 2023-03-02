import { action, computed, makeObservable, observable } from 'mobx';

import { defined, getTokenSlug, isExist, isNull, isTokenEqual, isTokenIncludes } from '@shared/helpers';
import { RootStore } from '@shared/store';
import { ManagedToken, Nullable, Optional, Token } from '@shared/types';

import { ExtendTokensModalCellProps } from './components';
import { isTokensQuantityValidation, TokensModalAbort, TokensModalInitialParams, TokensQuantityStatus } from './types';

const MAX_INPUT_COUNT = 2;

type TokensResolver = (value: Nullable<Array<Token>> | PromiseLike<Nullable<Array<Token>>>) => void;

export class TokensModalStore {
  isOpen = false;
  _chosenTokens: Nullable<Array<Token>> = null;
  initialTokens: Nullable<Array<Token>> = null;
  _disabledTokens: Nullable<Array<Token>> = null;
  isSingle: Nullable<boolean> = null;
  maxQuantity: Nullable<number> = null;
  minQuantity: Nullable<number> = null;
  cancelButtonProps: TokensModalInitialParams['cancelButtonProps'] = null;
  confirmButtonProps: TokensModalInitialParams['confirmButtonProps'] = null;

  inputIndex: Nullable<number> = null;
  chosenTokensSingleModal: Array<Token> = new Array(MAX_INPUT_COUNT).fill(null);

  private tokensResolver: Nullable<TokensResolver> = null;

  get chosenTokens(): Nullable<Array<Token>> {
    return this.checkVisibilityOfChosenTokens(this._chosenTokens);
  }

  get tokensQuantityStatus() {
    if (this.isSingle || isNull(this.minQuantity) || isNull(this.maxQuantity)) {
      return TokensQuantityStatus.OK;
    }
    const length = this.chosenTokens?.length;

    if (!length || length < defined(this.minQuantity)) {
      return TokensQuantityStatus.TOO_SMALL;
    } else if (length > defined(this.maxQuantity)) {
      return TokensQuantityStatus.TOO_MANY;
    }

    return TokensQuantityStatus.OK;
  }

  get isTokensQuantityOk() {
    return this.tokensQuantityStatus === TokensQuantityStatus.OK;
  }

  get extendTokens(): ExtendTokensModalCellProps[] {
    return this.rootStore.tokensManagerStore.filteredTokens.map(token => ({
      ...token,
      isChosen: this.isChosenToken(token),
      disabled: this.isDisabledToken(token)
    }));
  }

  constructor(private readonly rootStore: RootStore) {
    makeObservable(this, {
      isOpen: observable,
      _chosenTokens: observable,
      _disabledTokens: observable,
      isSingle: observable,
      maxQuantity: observable,
      minQuantity: observable,

      inputIndex: observable,
      chosenTokensSingleModal: observable,

      setOpenState: action,
      toggleChosenToken: action,
      setChosenTokens: action,
      setInitialTokens: action,
      setCancelButtonProps: action,
      setConfirmButtonProps: action,

      setInputIndex: action,
      setChooseToken: action,

      extendTokens: computed,
      tokensQuantityStatus: computed,
      isTokensQuantityOk: computed
    });
  }

  setOpenState(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  setInputIndex(index: number) {
    this.inputIndex = index;
  }

  setChooseToken(token: Optional<Token>) {
    if (!isExist(this.inputIndex) || !isExist(token)) {
      return;
    }

    this.chosenTokensSingleModal[this.inputIndex] = token;
    this.close();
  }

  setChosenTokens(tokens: Nullable<Array<Token>>) {
    this._chosenTokens = tokens;
  }

  setInitialTokens(tokens: Nullable<Array<Token>>) {
    this.initialTokens = tokens;
  }

  setDisabledTokens(tokens: Nullable<Array<Token>>) {
    this._disabledTokens = tokens;
  }

  setCancelButtonProps(props: TokensModalInitialParams['cancelButtonProps']) {
    this.cancelButtonProps = props;
  }

  setConfirmButtonProps(props: TokensModalInitialParams['confirmButtonProps']) {
    this.confirmButtonProps = props;
  }

  toggleChosenToken(token: ManagedToken) {
    if (this.isDisabledToken(token)) {
      return;
    }

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

    const isBenignClose = this.isTokensQuantityOk && !params?.abort;

    this.tokensResolver(isBenignClose ? this._chosenTokens : this.initialTokens);
    this.tokensResolver = null;
  }

  async open(params: TokensModalInitialParams = {}): Promise<Nullable<Array<Token>>> {
    const { tokens: initialTokens, disabledTokens, cancelButtonProps, confirmButtonProps } = params;

    if (isTokensQuantityValidation(params)) {
      this.minQuantity = params.min;
      this.maxQuantity = params.max;
    } else {
      this.isSingle = true;
    }

    this.setInitialTokens(initialTokens ?? null);
    this.setChosenTokens(initialTokens ?? null);
    this.setDisabledTokens(disabledTokens ?? null);
    this.setCancelButtonProps(cancelButtonProps);
    this.setConfirmButtonProps(confirmButtonProps);
    this.setOpenState(true);

    const tokens = await new Promise<Nullable<Array<Token>>>(resolve => {
      this.tokensResolver = resolve;
    });

    this.setOpenState(false);
    this.setChosenTokens(null);
    this.setInitialTokens(null);
    this.isSingle = null;
    this.minQuantity = null;
    this.maxQuantity = null;

    return tokens;
  }

  isChosenToken(token: Token) {
    return isTokenIncludes(token, this._chosenTokens);
  }

  isDisabledToken(token: Token) {
    return isTokenIncludes(token, this._disabledTokens);
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
