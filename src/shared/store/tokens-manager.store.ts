import { TezosToolkit } from '@taquito/taquito';
import { action, computed, makeObservable, observable } from 'mobx';

import { NETWORK } from '@config/config';
import { DEFAULT_TOKEN_ID, SKIP, SWAP } from '@config/constants';
import { NETWORK_ID } from '@config/enviroment';
import {
  getFavoritesTokensSlugsApi,
  getHiddenTokensSlugsApi,
  getTokenMetadata,
  hideTokenFromListApi,
  makeTokenVisibleInlistApi,
  markTokenAsFavotireApi,
  removeFavoriteMarkFromTokenApi,
  saveCustomTokenApi
} from '@shared/api';
import { getContract } from '@shared/dapp';
import { fa2TokenExists, getTokens, getTokenSlug, isEmptyArray, isNull, isTokenEqual } from '@shared/helpers';
import { ManagedToken, Standard, Token, TokenWithQSNetworkType } from '@shared/types';
import { isValidContractAddress } from '@shared/validators';

import { BaseFilterStore } from './base-filter.store';
import { RootStore } from './root.store';

//copypaste find a better way
const searchToken = async (tezos: TezosToolkit, address: string, tokenId?: number): Promise<Nullable<Token>> => {
  if (!isValidContractAddress(address)) {
    return null;
  }

  try {
    const tokenContract = await getContract(tezos, address);

    const isFa2 = Boolean(tokenContract.methods.update_operators);
    if (isFa2 && !(await fa2TokenExists(tezos, address, tokenId ?? DEFAULT_TOKEN_ID))) {
      return null;
    }

    const customToken = await getTokenMetadata({
      contractAddress: address,
      fa2TokenId: tokenId
    });

    if (!customToken) {
      return null;
    }

    const token: TokenWithQSNetworkType = {
      contractAddress: address,
      metadata: customToken,
      isWhitelisted: false,
      type: isFa2 ? Standard.Fa2 : Standard.Fa12,
      fa2TokenId: isFa2 ? tokenId || DEFAULT_TOKEN_ID : undefined,
      network: NETWORK_ID
    };

    return token;
  } catch (error) {
    return null;
  }
};

export class TokensManagerStore extends BaseFilterStore {
  managedTokens: Array<ManagedToken> = [];

  isSearching = false;

  get tokens() {
    return this.managedTokens.filter(token => !token.isHidden);
  }

  get filteredTokens() {
    if (this.search) {
      return this.managedTokens.filter(token => this.tokenMatchesSearch(token));
    } else {
      return this.tokens.filter(token => this.tokenMatchesSearch(token));
    }
  }

  get filteredManagedTokens() {
    return this.managedTokens.filter(token => this.tokenMatchesSearch(token));
  }

  constructor(private rootStore: RootStore) {
    super();
    makeObservable(this, {
      managedTokens: observable,
      isSearching: observable,

      loadTokens: action,
      saveCustomToken: action,
      addOrRemoveTokenFavorite: action,
      hideOrShowToken: action,
      searchCustomToken: action,

      tokens: computed,
      filteredTokens: computed
    });

    this.loadTokens();
  }

  async loadTokens() {
    this.managedTokens = await getTokens(NETWORK, true);

    /* move to helper*/
    const favoritesTokens = getFavoritesTokensSlugsApi();
    const hiddenTokens = getHiddenTokensSlugsApi();
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
    saveCustomTokenApi(token);

    this.managedTokens = [token as ManagedToken, ...this.managedTokens].sort(a => (a.isFavorite ? SKIP : SWAP));
  }

  addOrRemoveTokenFavorite(token: ManagedToken) {
    const localToken = { ...token };

    if (localToken.isFavorite) {
      removeFavoriteMarkFromTokenApi(token);
      localToken.isFavorite = false;
    } else {
      markTokenAsFavotireApi(token);
      localToken.isFavorite = true;
      if (localToken.isHidden) {
        makeTokenVisibleInlistApi(token);
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
      makeTokenVisibleInlistApi(token);
      localToken.isHidden = false;
    } else {
      hideTokenFromListApi(token);
      localToken.isHidden = true;
      if (localToken.isFavorite) {
        removeFavoriteMarkFromTokenApi(token);
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

  async searchCustomToken() {
    if (this.rootStore.tezos) {
      this.isSearching = true;

      const tokenId = isNull(this.tokenId) ? undefined : this.tokenId.toNumber();

      const token = await searchToken(this.rootStore.tezos, this.search, tokenId);

      if (token) {
        this.saveCustomToken(token);
      }

      this.isSearching = false;
    }
  }
}
