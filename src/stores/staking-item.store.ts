import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getStakingItemApi } from '@api/staking/get-staking-item.api';
import { getUserStakingDelegate } from '@api/staking/get-user-staking-delegate.api';
import { getUserStakingStats } from '@api/staking/get-user-staking-stats.api';
import { StakingTabs } from '@containers/staking/item/types';
import { RawStakingItem, RawUserStakingStats, StakingItem, UserStakingStats } from '@interfaces/staking.interfaces';
import { isNull } from '@utils/helpers';
import { balanceMap } from '@utils/mapping/balance.map';
import { noopMap } from '@utils/mapping/noop.map';
import { mapStakeItem } from '@utils/mapping/staking.map';
import { mapUserStakingStats } from '@utils/mapping/user-staking-stats.map';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const DEFAULT_INPUT_AMOUNT = 0;

export class StakingItemStore {
  stakingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawStakingItem, Nullable<StakingItem>>(
    null,
    async () => await getStakingItemApi(this.stakingId),
    mapStakeItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    balance => balanceMap(balance, this.itemStore.data?.tokenA)
  );

  userStakingStatsStore = new LoadingErrorData<Nullable<RawUserStakingStats>, Nullable<UserStakingStats>>(
    null,
    async () => await this.getUserStakingStats(),
    mapUserStakingStats
  );

  userStakingDelegateStore = new LoadingErrorData<Nullable<string>, Nullable<string>>(
    null,
    async () => await this.getUserStakingDelegate(),
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

  private getUserData = async <T>(
    fetchFn: (tezos: TezosToolkit, accountPkh: string, item: StakingItem) => Promise<T>
  ) => {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await fetchFn(tezos, authStore.accountPkh, item);
  };

  private async getUserTokenBalance() {
    return await this.getUserData(async (tezos, accountPkh, item) =>
      getUserTokenBalance(tezos, accountPkh, item.stakedToken)
    );
  }

  private async getUserStakingStats() {
    return await this.getUserData(async (tezos, accountPkh, item) => getUserStakingStats(tezos, accountPkh, item.id));
  }

  private async getUserStakingDelegate() {
    return await this.getUserData(async (tezos, accountPkh, item) =>
      getUserStakingDelegate(tezos, accountPkh, item.id)
    );
  }
}
