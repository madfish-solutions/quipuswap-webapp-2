import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getStakingItemApi } from '@api/staking/get-staking-item.api';
import { StakingTabs } from '@containers/staking/item/types';
import { RawStakingItem, StakingItem } from '@interfaces/staking.interfaces';
import { isNull } from '@utils/helpers';
import { noopMap } from '@utils/mapping/noop-map';
import { mapStakeItem } from '@utils/mapping/staking.map';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const DEFAULT_INPUT_AMOUNT = 0;

export class StakingItemStore {
  stakingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawStakingItem, Nullable<StakingItem>>(
    null,
    async () => await getStakingItemApi(this.stakingId, this.rootStore.authStore.accountPkh),
    mapStakeItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    noopMap
  );

  currentTab: StakingTabs = StakingTabs.stake;

  inputAmount = new BigNumber(DEFAULT_INPUT_AMOUNT);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      inputAmount: observable,
      selectedBaker: observable,

      isLpToken: computed,

      setTab: action,
      clearBalance: action,
      setInputAmount: action,
      setSelectedBaker: action
    });
    this.clearBalance();
  }

  setTab(tab: StakingTabs) {
    this.currentTab = tab;
  }

  setInputAmount(inputAmount: BigNumber.Value) {
    this.inputAmount = new BigNumber(inputAmount);
  }

  setSelectedBaker(selectedBaker: Nullable<WhitelistedBaker>) {
    this.selectedBaker = selectedBaker;
  }

  clearBalance() {
    this.setInputAmount(DEFAULT_INPUT_AMOUNT);
  }

  setStakingId(stakingId: Nullable<BigNumber>) {
    this.stakingId = stakingId;
  }

  get isLpToken() {
    return Boolean(this.itemStore.data?.tokenB);
  }

  private async getUserTokenBalance() {
    if (isNull(this.rootStore.tezos) || isNull(this.rootStore.authStore.accountPkh) || isNull(this.itemStore.data)) {
      return null;
    }

    return getUserTokenBalance(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.itemStore.data?.tokenA);
  }
}
