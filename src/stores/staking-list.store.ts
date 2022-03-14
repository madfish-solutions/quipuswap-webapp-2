import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
import { NETWORK_ID } from '@app.config';
import { SortType, SortValue } from '@containers/staking/list/components';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem, StakingStatus } from '@interfaces/staking.interfaces';
import { defined, isExist, isNull, localSearchToken, TokenWithRequiredNetwork } from '@utils/helpers';
import { isEmptyString } from '@utils/helpers/strings';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';
import { Token } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const ZERO_AMOUNT = 0;
const CHANGE = 1;
const SKIP = -1;

const sortBigNumber = (first: Nullable<BigNumber>, second: Nullable<BigNumber>, up: SortValue['up']) => {
  if (isNull(first)) {
    return CHANGE;
  }

  if (isNull(second)) {
    return SKIP;
  }

  const isFirstBigger = first.isGreaterThan(second);

  return up === isFirstBigger ? CHANGE : SKIP;
};
export class StakingListStore {
  listStore = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => await getStakingListApi(this.rootStore.authStore.accountPkh, defined(this.rootStore.tezos)),
    mapStakesItems
  );

  statsStore = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  get pendingRewards() {
    const rewardsInUsd = this.listStore.data.map(({ earnBalance, earnExchangeRate }) =>
      earnBalance && earnExchangeRate ? earnBalance.multipliedBy(earnExchangeRate) : null
    );

    return rewardsInUsd.reduce<BigNumber>(
      (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  get list() {
    let list = this.listStore.data;

    if (this.stakedOnly) {
      list = list.filter(({ depositBalance }) => isExist(depositBalance) && depositBalance.isGreaterThan('0'));
    }

    if (this.activeOnly) {
      list = list.filter(({ stakeStatus }) => stakeStatus === StakingStatus.ACTIVE);
    }

    if (this.search) {
      list = list.filter(
        ({ stakedToken, rewardToken, tokenA, tokenB }) =>
          this.searchToken(stakedToken) ||
          this.searchToken(rewardToken) ||
          this.searchToken(tokenA) ||
          (isExist(tokenB) && this.searchToken(tokenB))
      );
    }

    return this.sort(list, this.sortValue);
  }

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
      pendingRewards: computed,
      list: computed,
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

  private sort(list: Array<StakingItem>, sortValue: Nullable<SortValue>) {
    if (isNull(sortValue)) {
      return list;
    }

    const localList = [...list];

    localList.sort((first, second) => {
      switch (sortValue.value) {
        case SortType.APR:
          return sortBigNumber(first.apr, second.apr, sortValue.up);
        case SortType.APY:
          return sortBigNumber(first.apy, second.apy, sortValue.up);
        case SortType.BALANCE:
          return sortBigNumber(first.myBalance, second.myBalance, sortValue.up);
        case SortType.DEPOSIT:
          return sortBigNumber(first.depositBalance, second.depositBalance, sortValue.up);
        case SortType.EARNED:
          return sortBigNumber(first.earnBalance, second.earnBalance, sortValue.up);
        case SortType.TVL:
          return sortBigNumber(first.tvlInUsd, second.tvlInUsd, sortValue.up);
        default:
          throw new Error('Invalid sort type'); //never happend
      }
    });

    return localList;
  }

  private searchToken(token: Token): boolean {
    return localSearchToken(token as TokenWithRequiredNetwork, NETWORK_ID, this.search, this.tokenId?.toNumber());
  }
}
