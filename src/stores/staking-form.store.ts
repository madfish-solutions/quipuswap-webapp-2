import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { StakingTabs } from '@containers/staking/item/types';
import { StakingItem } from '@interfaces/staking.interfaces';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { RootStore } from './root.store';

const DEFAULT_BALANCE = 0;

export class StakingFormStore {
  stakeItem: Nullable<StakingItem> = null;
  currentTab: StakingTabs = StakingTabs.stake;
  availableBalance: Nullable<BigNumber> = null;

  balance = new BigNumber(DEFAULT_BALANCE);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  isLoading = false;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      stakeItem: observable,
      balance: observable,
      selectedBaker: observable,
      isLoading: observable,
      availableBalance: observable,

      isLpToken: computed,

      setTab: action,
      setStakeItem: action,
      clearBalance: action,
      setBalance: action,
      setSelectedBaker: action,
      stake: action,
      unstake: action,
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

  async stake() {
    // eslint-disable-next-line no-console
    console.log('stake');
    this.isLoading = true;
  }

  async unstake() {
    // eslint-disable-next-line no-console
    console.log('unstake');
    this.isLoading = true;
  }

  get isLpToken() {
    return Boolean(this.stakeItem?.tokenB);
  }

  setAvailableBalance(balance: Nullable<BigNumber>) {
    this.availableBalance = balance;
  }

  async loadAvailableBalance() {
    if (!this.rootStore.tezos || !this.rootStore.authStore.accountPkh || !this.stakeItem?.tokenA) {
      this.setAvailableBalance(null);

      return;
    }

    const balance = await getUserTokenBalance(
      this.rootStore.tezos,
      this.rootStore.authStore.accountPkh,
      this.stakeItem.tokenA
    );
    this.setAvailableBalance(balance);
  }
}
