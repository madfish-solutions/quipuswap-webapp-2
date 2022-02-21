import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { StakingTabs } from '@containers/staking/item/types';
import { StakingItem } from '@interfaces/staking.interfaces';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { RootStore } from './root.store';

const DEFAULT_BALANCE = 0;

export class StakingItemStore {
  stakeItem: Nullable<StakingItem> = null;
  currentTab: StakingTabs = StakingTabs.stake;
  availableBalance: Nullable<BigNumber> = null;

  balance = new BigNumber(DEFAULT_BALANCE);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      stakeItem: observable,
      balance: observable,
      selectedBaker: observable,
      availableBalance: observable,

      isLpToken: computed,

      setTab: action,
      setStakeItem: action,
      clearBalance: action,
      setBalance: action,
      setSelectedBaker: action,
      setAvailableBalance: action
    });
    this.clearBalance();
  }

  setTab(tab: StakingTabs) {
    this.currentTab = tab;
  }

  setStakeItem(stakeItem: Nullable<StakingItem>) {
    this.stakeItem = stakeItem;
  }

  setBalance(balance: BigNumber.Value) {
    this.balance = new BigNumber(balance);
  }

  setSelectedBaker(selectedBaker: Nullable<WhitelistedBaker>) {
    this.selectedBaker = selectedBaker;
  }

  clearBalance() {
    this.setBalance(DEFAULT_BALANCE);
  }

  get isLpToken() {
    return Boolean(this.stakeItem?.tokenB);
  }

  setAvailableBalance(balance: Nullable<BigNumber>) {
    this.availableBalance = balance;
  }

  findStakeItem(stakingId: BigNumber) {
    const stakeItem = this.rootStore.stakingListStore.list.data.find(({ id }) => stakingId.eq(id)) || null;
    this.setStakeItem(stakeItem);

    if (!stakeItem) {
      throw new Error('StakeItem not found: ' + stakingId.toFixed());
    }

    return stakeItem;
  }
}
