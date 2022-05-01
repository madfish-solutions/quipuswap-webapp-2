import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_TOKEN_ID, STEP } from '@config/constants';
import { isEmptyString, isExist, isNull } from '@shared/helpers';
import { RootStore } from '@shared/store';
import { Nullable, Optional, Token } from '@shared/types';

import { SortDirection, sortStableswapList, SortField } from '../helpers';
import { StableswapItem } from '../types';

const includesCaseInsensitive = (strA: Optional<string>, strB: string) => {
  if (isExist(strA)) {
    return strA.toLowerCase().includes(strB.toLowerCase());
  }

  return false;
};

const isZeroTokenId = (tokenId: Optional<number>) => {
  return !isExist(tokenId) || tokenId === DEFAULT_TOKEN_ID;
};

export class StableswapFilterStore {
  get tokenIdValue() {
    if (isNull(this.tokenId)) {
      return '';
    } else {
      return this.tokenId.toString();
    }
  }

  whitelistedOnly = true;
  search = '';
  tokenId: Nullable<BigNumber> = null;
  sortField: SortField = SortField.ID;
  sortDirection: SortDirection = SortDirection.DESC;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      whitelistedOnly: observable,
      search: observable,
      tokenId: observable,
      sortField: observable,
      sortDirection: observable,

      setWhitelistedOnly: action,
      onSearchChange: action,
      onTokenIdChange: action,
      handleIncrement: action,
      handleDecrement: action,
      onSortFieldChange: action,
      onSortDirectionToggle: action,

      tokenIdValue: computed
    });
  }

  filterAndSort(list: Array<StableswapItem>) {
    if (this.whitelistedOnly) {
      list = list.filter(({ isWhitelisted }) => isWhitelisted);
    }

    if (this.search) {
      list = list.filter(({ tokensInfo }) => {
        return tokensInfo.map(({ token }) => this.tokenMatchesSearch(token)).some(Boolean);
      });
    }

    return sortStableswapList(list, this.sortField, this.sortDirection);
  }

  setWhitelistedOnly(state: boolean) {
    this.whitelistedOnly = state;
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

  onSortFieldChange(field: SortField) {
    this.sortField = field;
  }

  onSortDirectionToggle() {
    this.sortDirection = this.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
  }

  private tokenMatchesSearch({ metadata, contractAddress, fa2TokenId }: Token, contractOnly?: boolean): boolean {
    const isContract = contractAddress === this.search;

    const tokenId = this.tokenId?.toNumber();

    const fa2TokenIdMatches = (isZeroTokenId(tokenId) && isZeroTokenId(fa2TokenId)) || tokenId === fa2TokenId;

    if (contractOnly) {
      return isContract && fa2TokenIdMatches;
    }

    const isName = includesCaseInsensitive(metadata?.name, this.search);

    const isSymbol = includesCaseInsensitive(metadata?.symbol, this.search);

    return isName || isSymbol || (isContract && fa2TokenIdMatches);
  }
}
