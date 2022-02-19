import BigNumber from 'bignumber.js';
import { action, makeObservable, observable, computed } from 'mobx';

import { StakingTabs } from '@containers/stake/item/types';
import { StakeItem } from '@interfaces/staking.interfaces';
import { Nullable, TokenPair } from '@utils/types';

const DEFAULT_BALANCE = 0;

export class StakingFormStore {
  stakeItem: Nullable<StakeItem> = null;
  currentTab: StakingTabs = StakingTabs.stake;
  balance = new BigNumber(DEFAULT_BALANCE);
  isLoading = false;

  constructor() {
    makeObservable(this, {
      currentTab: observable,
      stakeItem: observable,
      balance: observable,
      isLoading: observable,
      isLpToken: computed,
      tokenPair: computed,
      setTab: action,
      setStakeItem: action,
      clearBalance: action,
      setBalance: action,
      stake: action,
      unstake: action
    });
    this.clearBalance();
  }

  setTab(tab: StakingTabs) {
    this.currentTab = tab;
  }

  setStakeItem(stakeItem: Nullable<StakeItem>) {
    this.stakeItem = stakeItem;
  }

  setBalance(balance: BigNumber.Value) {
    this.balance = new BigNumber(balance);
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

  get tokenPair(): Nullable<TokenPair> {
    if (!this.stakeItem || !this.stakeItem.tokenB) {
      return null;
    }

    return {
      // balance: Nullable<string>, // TODO
      // frozenBalance: Nullable<string>, // TODO
      token1: this.stakeItem.tokenA,
      token2: this.stakeItem.tokenB
    };
  }
}
