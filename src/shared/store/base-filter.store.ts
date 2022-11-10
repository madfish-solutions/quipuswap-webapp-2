import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_TOKEN_ID, STEP } from '@config/constants';
import { ManagedToken, Nullable, Token } from '@shared/types';

import { includesCaseInsensitive, isEmptyString, isExist, isNull, isZeroTokenId, SortDirection } from '../helpers';
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

  protected searchToken(token: Token, contractOnly?: boolean): boolean {
    const { metadata, contractAddress, fa2TokenId } = token;
    const isContract = contractAddress === this.search;

    const tokenId = this.tokenId?.toNumber();

    const fa2TokenIdMatches = (isZeroTokenId(tokenId) && isZeroTokenId(fa2TokenId)) || tokenId === fa2TokenId;

    if (isExist(tokenId) || contractOnly) {
      return isContract && fa2TokenIdMatches;
    }

    const isName = includesCaseInsensitive(metadata?.name, this.search);

    const isSymbol = includesCaseInsensitive(metadata?.symbol, this.search);

    return isName || isSymbol || isContract;
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
