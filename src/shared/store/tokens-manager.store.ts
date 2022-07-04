import { action, computed, makeObservable, observable } from 'mobx';

import { NETWORK } from '@config/config';
import { SKIP, SWAP } from '@config/constants';
import {
  getFavoritesTokensSlugs,
  getHiddenTokensSlugs,
  getTokens,
  getTokenSlug,
  hideTokenFromList,
  isEmptyArray,
  isTokenEqual,
  makeTokenVisibleInlist,
  markTokenAsFavotire,
  removeFavoriteMarkFromToken,
  saveCustomToken
} from '@shared/helpers';
import { ManagedToken, TokenWithQSNetworkType } from '@shared/types';

import { BaseFilterStore } from './base-filter.store';
import { RootStore } from './root.store';

export class TokensManagerStore extends BaseFilterStore {
  managedTokens: Array<ManagedToken> = [];

  get tokens() {
    return this.managedTokens.filter(token => !token.isHidden);
  }

  get filteredTokens() {
    return this.tokens.filter(token => this.tokenMatchesSearch(token));
  }

  get filteredManagedTokens() {
    return this.managedTokens.filter(token => this.tokenMatchesSearch(token));
  }

  constructor(rootStore: RootStore) {
    super();
    makeObservable(this, {
      managedTokens: observable,

      loadTokens: action,
      saveCustomToken: action,
      addOrRemoveTokenFavorite: action,

      tokens: computed,
      filteredTokens: computed
    });

    this.loadTokens();
  }

  async loadTokens() {
    this.managedTokens = await getTokens(NETWORK, true);

    /* move to helper*/
    const favoritesTokens = getFavoritesTokensSlugs();
    const hiddenTokens = getHiddenTokensSlugs();
    if (!isEmptyArray(favoritesTokens) || !isEmptyArray(hiddenTokens)) {
      this.managedTokens.forEach(token => {
        if (favoritesTokens.includes(getTokenSlug(token))) {
          token.isFavorite = true;
        }
        if (hiddenTokens.includes(getTokenSlug(token))) {
          token.isHidden = true;
        }
      });

      this.managedTokens.sort(a => (a.isFavorite ? SKIP : SWAP));
    }
  }

  saveCustomToken(token: TokenWithQSNetworkType) {
    saveCustomToken(token);

    this.managedTokens = [token as ManagedToken, ...this.managedTokens].sort(a => (a.isFavorite ? SKIP : SWAP));
  }

  addOrRemoveTokenFavorite(token: ManagedToken) {
    const localToken = { ...token };

    if (localToken.isFavorite) {
      removeFavoriteMarkFromToken(token);
      localToken.isFavorite = false;
    } else {
      markTokenAsFavotire(token);
      localToken.isFavorite = true;
      if (localToken.isHidden) {
        makeTokenVisibleInlist(token);
        localToken.isHidden = false;
      }
    }

    const tokensWithoutCurrent = this.managedTokens.filter(_token => !isTokenEqual(_token, token));

    if (localToken.isFavorite) {
      this.managedTokens = [localToken, ...tokensWithoutCurrent];
    } else {
      const favoritesTokens = tokensWithoutCurrent.filter(_token => _token.isFavorite);
      const notFavoritesTokens = tokensWithoutCurrent.filter(_token => !_token.isFavorite);

      this.managedTokens = [...favoritesTokens, localToken, ...notFavoritesTokens];
    }
  }

  hideOrShowToken(token: ManagedToken) {
    const localToken = { ...token };

    if (localToken.isHidden) {
      makeTokenVisibleInlist(token);
      localToken.isHidden = false;
    } else {
      hideTokenFromList(token);
      localToken.isHidden = true;
      if (localToken.isFavorite) {
        removeFavoriteMarkFromToken(token);
        localToken.isFavorite = false;
      }
    }

    if (token.isFavorite) {
      const tokensWithoutCurrent = this.managedTokens.filter(_token => !isTokenEqual(_token, token));

      const favoritesTokens = tokensWithoutCurrent.filter(_token => _token.isFavorite);
      const notFavoritesTokens = tokensWithoutCurrent.filter(_token => !_token.isFavorite);

      this.managedTokens = [...favoritesTokens, localToken, ...notFavoritesTokens];
    } else {
      this.managedTokens = this.managedTokens.map((_token, index) => {
        return isTokenEqual(_token, token) ? localToken : _token;
      });
    }
  }
}
