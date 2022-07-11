import { TezosToolkit } from '@taquito/taquito';
import { action, computed, makeObservable, observable } from 'mobx';

import { NETWORK } from '@config/config';
import { DEFAULT_TOKEN_ID } from '@config/constants';
import { NETWORK_ID } from '@config/enviroment';
import {
  getTokenMetadata,
  getFavoritesTokensSlugsApi,
  getHiddenTokensSlugsApi,
  saveCustomTokenApi,
  makeTokenVisibleInlistApi,
  hideTokenFromListApi,
  markTokenAsFavotireApi,
  removeFavoriteMarkFromTokenApi
} from '@shared/api';
import { getContract } from '@shared/dapp';
import { fa2TokenExists, getTokens, getTokenSlug, isEmptyArray, isNull } from '@shared/helpers';
import { ManagedToken, Standard, Token, TokenWithQSNetworkType } from '@shared/types';
import { isValidContractAddress } from '@shared/validators';

import { BaseFilterStore } from './base-filter.store';
import { RootStore } from './root.store';
import { sortManagedToken } from './utils';

// copy-past find a better way
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
    return this.managedTokens.filter(token => !token.isHidden).sort(sortManagedToken);
  }

  get filteredTokens() {
    const tokens = this.search ? this.managedTokens : this.tokens;

    return tokens.filter(token => this.tokenMatchesSearch(token)).sort(sortManagedToken);
  }

  get filteredManagedTokens() {
    return this.managedTokens.filter(token => this.tokenMatchesSearch(token)).sort(sortManagedToken);
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

    void this.loadTokens();
  }

  private manageTokens() {
    /* move to helper*/
    const favoritesTokens = getFavoritesTokensSlugsApi();
    const hiddenTokens = getHiddenTokensSlugsApi();
    if (isEmptyArray(favoritesTokens) && isEmptyArray(hiddenTokens)) {
      return;
    }

    this.managedTokens.forEach(token => {
      if (favoritesTokens.includes(getTokenSlug(token)) && !token.isFavorite) {
        token.isFavorite = true;
      }
      if (hiddenTokens.includes(getTokenSlug(token)) && !token.isHidden) {
        token.isHidden = true;
      }
    });

    this.managedTokens.sort(sortManagedToken);
  }

  async loadTokens() {
    this.managedTokens = await getTokens(NETWORK, true);
    this.manageTokens();
  }

  async saveCustomToken(token: TokenWithQSNetworkType) {
    saveCustomTokenApi(token);

    return this.loadTokens();
  }

  makeTokenVisible(token: ManagedToken) {
    token.isHidden = false;
    makeTokenVisibleInlistApi(token);
    this.manageTokens();
  }

  makeTokenHidden(token: ManagedToken) {
    token.isHidden = true;
    this.removeTokenFavorite(token);
    hideTokenFromListApi(token);
    this.manageTokens();
  }

  addTokenFavorite(token: ManagedToken) {
    token.isFavorite = true;
    this.makeTokenVisible(token);
    markTokenAsFavotireApi(token);
    this.manageTokens();
  }

  removeTokenFavorite(token: ManagedToken) {
    token.isFavorite = false;
    removeFavoriteMarkFromTokenApi(token);
    this.manageTokens();
  }

  addOrRemoveTokenFavorite(token: ManagedToken) {
    if (token.isFavorite) {
      this.removeTokenFavorite(token);
    } else {
      this.addTokenFavorite(token);
    }
  }

  hideOrShowToken(token: ManagedToken) {
    if (token.isHidden) {
      this.makeTokenVisible(token);
    } else {
      this.makeTokenHidden(token);
    }
  }

  async searchCustomToken() {
    if (this.rootStore.tezos) {
      this.isSearching = true;

      const tokenId = isNull(this.tokenId) ? undefined : this.tokenId.toNumber();

      const token = await searchToken(this.rootStore.tezos, this.search, tokenId);

      if (token) {
        await this.saveCustomToken(token);
      }

      this.isSearching = false;
    }
  }
}
