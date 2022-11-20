import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_TOKEN_ID, STEP } from '@config/constants';
import { ManagedToken, Nullable, Token } from '@shared/types';

import { isEmptyString, isNull, SortDirection, tokenMatchesSearch } from '../helpers';
import { RootStore } from './root.store';
import { sortByBalance, sortByFavorite, sortByName } from './utils';

export class BaseFilterStore {
  get tokenIdValue() {
    if (isNull(this.tokenId)) {
      return '';
    } else {
      return this.tokenId.toString();
    }
  }

  search = '';
  tokenId: Nullable<BigNumber> = null;
  sortDirection: SortDirection = SortDirection.DESC;

  constructor(protected rootStore: RootStore) {
    makeObservable(this, {
      search: observable,
      tokenId: observable,
      sortDirection: observable,

      onSearchChange: action,
      onTokenIdChange: action,
      handleIncrement: action,
      handleDecrement: action,
      onSortDirectionToggle: action,

      tokenIdValue: computed
    });
  }

  onSearchChange(search: string) {
    this.search = search;
  }

  onTokenIdChange(value: string) {
    if (isEmptyString(value)) {
      this.tokenId = null;
    } else {
      this.tokenId = new BigNumber(value);
    }
  }

  handleIncrement() {
    if (isNull(this.tokenId)) {
      this.tokenId = new BigNumber(DEFAULT_TOKEN_ID);
    } else {
      this.tokenId = this.tokenId.plus(STEP);
    }
  }

  handleDecrement() {
    if (isNull(this.tokenId)) {
      this.tokenId = new BigNumber(DEFAULT_TOKEN_ID);
    } else if (this.tokenId.isGreaterThan(DEFAULT_TOKEN_ID)) {
      this.tokenId = this.tokenId.minus(STEP);
    }
  }

  onSortDirectionToggle() {
    this.sortDirection = this.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
  }

  // TODO: move to hook
  protected searchToken(token: Token, contractOnly?: boolean): boolean {
    return tokenMatchesSearch(token, this.search, this.tokenId, contractOnly);
  }

  private isSortableByBalance(token: ManagedToken) {
    return !!this.rootStore.tokensBalancesStore.getTokenBalance(token);
  }

  private getTokenBalance(token: ManagedToken) {
    return this.rootStore.tokensBalancesStore.getTokenBalance(token);
  }

  protected orderTokens(a: ManagedToken, b: ManagedToken) {
    if (a.isFavorite !== b.isFavorite) {
      return sortByFavorite(a);
    }

    if (this.isSortableByBalance(a) || this.isSortableByBalance(b)) {
      return sortByBalance(this.getTokenBalance(a), this.getTokenBalance(a));
    }

    return sortByName(a, b);
  }
}
