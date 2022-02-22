import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getStakingItemApi } from '@api/staking/get-staking-item.api';
import { StakingTabs } from '@containers/staking/item/types';
import { RawStakingItem, StakingItem } from '@interfaces/staking.interfaces';
import { copy } from '@utils/mapping/copy';
import { mapStakeItem } from '@utils/mapping/staking.map';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const DEFAULT_BALANCE = 0;

export class StakingItemStore {
  stakingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawStakingItem, Nullable<StakingItem>>(
    null,
    async () => getStakingItemApi(this.stakingId, this.rootStore.authStore.accountPkh),
    mapStakeItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => this.getUserTokenBalance(),
    copy
  );

  currentTab: StakingTabs = StakingTabs.stake;

  balance = new BigNumber(DEFAULT_BALANCE);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      balance: observable,
      selectedBaker: observable,

      isLpToken: computed,

      setTab: action,
      clearBalance: action,
      setBalance: action,
      setSelectedBaker: action
    });
    this.clearBalance();
  }

  setTab(tab: StakingTabs) {
    this.currentTab = tab;
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

  setStakingId(stakingId: Nullable<BigNumber>) {
    this.stakingId = stakingId;
  }

  get isLpToken() {
    return Boolean(this.itemStore.data?.tokenB);
  }

  private async getUserTokenBalance() {
    if (!this.rootStore.tezos || !this.rootStore.authStore.accountPkh || !this.itemStore.data) {
      return null;
    }

    return getUserTokenBalance(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.itemStore.data?.tokenA);
  }
}
