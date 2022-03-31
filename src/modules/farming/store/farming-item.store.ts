import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL } from '@config/config';
import { fromDecimals, isNull, MakeInterval } from '@shared/helpers';
import { balanceMap, mapFarmingItem, noopMap } from '@shared/mapping';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable, WhitelistedBaker } from '@shared/types/types';

import { getUserPendingReward, getFarmingItemApi, getUserInfoApi, getUserFarmingDelegate } from '../api';
import { RawFarmingItem, FarmingItem, UsersInfoValue } from '../interfaces';
import { FarmingFormTabs } from '../pages/item';

const DEFAULT_INPUT_AMOUNT = 0;

export class FarmingItemStore {
  farmingId: Nullable<BigNumber> = null;

  itemStore = new LoadingErrorData<RawFarmingItem, Nullable<FarmingItem>>(
    null,
    async () => await getFarmingItemApi(this.farmingId),
    mapFarmingItem
  );

  availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  userInfoStore = new LoadingErrorData<Nullable<UsersInfoValue>, Nullable<UsersInfoValue>>(
    null,
    async () => await this.getUserInfo(),
    noopMap
  );

  userFarmingDelegateStore = new LoadingErrorData<Nullable<string>, Nullable<string>>(
    null,
    async () => await this.getUserFarmingDelegate(),
    noopMap
  );

  currentTab: FarmingFormTabs = FarmingFormTabs.stake;

  inputAmount = new BigNumber(DEFAULT_INPUT_AMOUNT);
  selectedBaker: Nullable<WhitelistedBaker> = null;
  pendingRewards: Nullable<BigNumber> = null;
  pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  updateUserInfoInterval = new MakeInterval(async () => this.userInfoStore.load(), FARM_USER_INFO_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      inputAmount: observable,
      selectedBaker: observable,
      pendingRewards: observable,

      setTab: action,
      clearBalance: action,
      setInputAmount: action,
      setSelectedBaker: action,
      updatePendingRewards: action,

      farmingItem: computed
    });
    this.clearBalance();
  }

  get farmingItem(): Nullable<FarmingItem> {
    const { data: stakeItem } = this.itemStore;
    const { data: userInfo } = this.userInfoStore;

    return (
      stakeItem && {
        ...stakeItem,
        depositBalance: userInfo && fromDecimals(userInfo.staked, stakeItem.stakedToken),
        earnBalance: this.pendingRewards && fromDecimals(this.pendingRewards, stakeItem.rewardToken)
      }
    );
  }

  makePendingRewardsLiveable() {
    this.pendingRewardsInterval.start();
    this.updateUserInfoInterval.start();
  }

  updatePendingRewards() {
    const { data: userInfo } = this.userInfoStore;
    const { data: item } = this.itemStore;

    this.pendingRewards = userInfo && item && getUserPendingReward(userInfo, item);
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateUserInfoInterval.stop();
  }

  setTab(tab: FarmingFormTabs) {
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

  setFarmingId(farmingId: Nullable<BigNumber>) {
    this.farmingId = farmingId;
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserInfoApi(item, authStore.accountPkh, tezos);
  }

  private async getUserTokenBalance() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserTokenBalance(tezos, authStore.accountPkh, item.stakedToken);
  }

  private async getUserFarmingDelegate() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserFarmingDelegate(tezos, authStore.accountPkh, item.id);
  }
}
