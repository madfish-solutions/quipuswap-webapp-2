/* eslint-disable no-console */
import { BigNumber } from 'bignumber.js';
import { observable, makeObservable, action, computed } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL } from '@config/constants';
import { fromDecimals, isNull, MakeInterval } from '@shared/helpers';
import { balanceMap, noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, WhitelistedBaker } from '@shared/types';

import { getFarmingItemApi, getUserFarmingDelegate, getUserInfoApi } from '../api';
import { getUserPendingReward } from '../helpers';
import { FarmingItem, RawFarmingItem, RawUsersInfoValue, UsersInfoValue } from '../interfaces';
import { mapFarmingItem, mapUsersInfoValue } from '../mapping';
import { FarmingFormTabs } from '../pages/item/types'; //TODO

const DEFAULT_INPUT_AMOUNT = 0;

export class FarmingItemStore {
  farmingId: Nullable<BigNumber> = null;

  readonly itemStore = new LoadingErrorData<RawFarmingItem, Nullable<FarmingItem>>(
    null,
    async () => await getFarmingItemApi(this.farmingId),
    mapFarmingItem
  );

  readonly availableBalanceStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getUserTokenBalance(),
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  readonly userInfoStore = new LoadingErrorData<Nullable<RawUsersInfoValue>, Nullable<UsersInfoValue>>(
    null,
    async () => await this.getUserInfo(),
    mapUsersInfoValue
  );

  readonly userFarmingDelegateStore = new LoadingErrorData<Nullable<string>, Nullable<string>>(
    null,
    async () => await this.getUserFarmingDelegate(),
    noopMap
  );

  currentTab: FarmingFormTabs = FarmingFormTabs.stake;

  inputAmount = new BigNumber(DEFAULT_INPUT_AMOUNT);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  pendingRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);
  readonly updateUserInfoInterval = new MakeInterval(
    async () => this.userInfoStore.load(),
    FARM_USER_INFO_UPDATE_INTERVAL
  );

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
