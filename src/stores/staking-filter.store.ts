import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { sortStakingList, SortValue } from '@containers/staking/list/components';
import { StakingItem, StakingStatus } from '@interfaces/staking.interfaces';
import { isExist, isNull } from '@utils/helpers';
import { isEmptyString } from '@utils/helpers/strings';
import { Token } from '@utils/types';

import { RootStore } from './root.store';

export class StakingFilterStore {
  get tokenIdValue() {
    if (isNull(this.tokenId)) {
      return '';
    } else {
      return this.tokenId.toString();
    }
  }

  stakedOnly = false;
  activeOnly = false;
  search = '';
  tokenId: Nullable<BigNumber> = null;
  sortValue: Nullable<SortValue> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stakedOnly: observable,
      activeOnly: observable,
      search: observable,
      tokenId: observable,
      sortValue: observable,
      setStakedOnly: action,
      setActiveOnly: action,
      onSearchChange: action,
      onTokenIdChange: action,
      handleIncrement: action,
      handleDecrement: action,
      onSorterChange: action
    });
  }

  filterAndSort(list: Array<StakingItem>) {
    if (this.stakedOnly) {
      list = list.filter(({ depositBalance }) => isExist(depositBalance) && depositBalance.isGreaterThan('0'));
    }

    if (this.activeOnly) {
      list = list.filter(({ stakeStatus }) => stakeStatus === StakingStatus.ACTIVE);
    }

    if (this.search) {
      list = list.filter(
        ({ stakedToken, rewardToken, tokenA, tokenB }) =>
          this.searchToken(stakedToken, true) ||
          this.searchToken(rewardToken) ||
          this.searchToken(tokenA) ||
          (isExist(tokenB) && this.searchToken(tokenB))
      );
    }

    return sortStakingList(list, this.sortValue);
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
      this.tokenId = new BigNumber('0');
    } else {
      this.tokenId = this.tokenId.plus('1');
    }
  }

  handleDecrement() {
    if (isNull(this.tokenId)) {
      this.tokenId = new BigNumber('0');
    } else if (this.tokenId.isGreaterThan('0')) {
      this.tokenId = this.tokenId.minus('1');
    }
  }

  onSorterChange(value: SortValue) {
    this.sortValue = value;
  }

  private searchToken({ metadata, contractAddress, fa2TokenId }: Token, contractOnly?: boolean): boolean {
    const isContract = contractAddress === this.search;

    const tokenId = this.tokenId?.toNumber();

    const fa2TokenIdMatches = (isNull(this.tokenId) || tokenId === 0) && (fa2TokenId === 0 || fa2TokenId === undefined);

    if (contractOnly) {
      return isContract && fa2TokenIdMatches;
    }

    const isName = metadata?.name?.toLowerCase().includes(this.search.toLowerCase());

    const isSymbol =
      metadata?.symbol?.toLowerCase().includes(this.search.toLowerCase()) && metadata?.symbol !== contractAddress;

    return isName || isSymbol || (isContract && fa2TokenIdMatches);
  }
}
