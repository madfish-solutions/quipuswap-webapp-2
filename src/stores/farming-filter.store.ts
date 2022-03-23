import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { SortDirection, SortField, sortStakingList } from '@containers/farming/list/components';
import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { FarmingItem } from '@interfaces/farming.interfaces';
import { isExist, isNull } from '@utils/helpers';
import { isEmptyString } from '@utils/helpers/strings';
import { Optional, Token } from '@utils/types';

import { RootStore } from './root.store';

const ZERO = 0;
export const STEP = 1;

const includesCaseInsensitive = (strA: Optional<string>, strB: string) => {
  if (isExist(strA)) {
    return strA.toLowerCase().includes(strB.toLowerCase());
  }

  return false;
};

const isZeroTokenId = (tokenId: Optional<number>) => {
  return !isExist(tokenId) || tokenId === ZERO;
};

export class FarmingFilterStore {
  get tokenIdValue() {
    if (isNull(this.tokenId)) {
      return '';
    } else {
      return this.tokenId.toString();
    }
  }

  stakedOnly = false;
  activeOnly = true;
  search = '';
  tokenId: Nullable<BigNumber> = null;
  sortField: SortField = SortField.ID;
  sortDirection: SortDirection = SortDirection.DESC;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stakedOnly: observable,
      activeOnly: observable,
      search: observable,
      tokenId: observable,
      sortField: observable,
      sortDirection: observable,
      setStakedOnly: action,
      setActiveOnly: action,
      onSearchChange: action,
      onTokenIdChange: action,
      handleIncrement: action,
      handleDecrement: action,
      onSortFieldChange: action,
      onSortDirectionToggle: action,
      tokenIdValue: computed
    });
  }

  filterAndSort(list: Array<FarmingItem>) {
    if (this.stakedOnly) {
      list = list.filter(({ depositBalance }) => isExist(depositBalance) && depositBalance.isGreaterThan('0'));
    }

    if (this.activeOnly) {
      list = list.filter(({ stakeStatus }) => stakeStatus === ActiveStatus.ACTIVE);
    }

    if (this.search) {
      list = list.filter(
        ({ stakedToken, rewardToken, tokenA, tokenB }) =>
          this.tokenMatchesSearch(stakedToken, true) ||
          this.tokenMatchesSearch(rewardToken) ||
          this.tokenMatchesSearch(tokenA) ||
          (isExist(tokenB) && this.tokenMatchesSearch(tokenB))
      );
    }

    return sortStakingList(list, this.sortField, this.sortDirection);
  }

  setStakedOnly(state: boolean) {
    this.stakedOnly = state;
  }

  setActiveOnly(state: boolean) {
    this.activeOnly = state;
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
      this.tokenId = new BigNumber(ZERO);
    } else {
      this.tokenId = this.tokenId.plus(STEP);
    }
  }

  handleDecrement() {
    if (isNull(this.tokenId)) {
      this.tokenId = new BigNumber(ZERO);
    } else if (this.tokenId.isGreaterThan(ZERO)) {
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
