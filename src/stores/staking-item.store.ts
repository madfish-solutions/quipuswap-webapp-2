import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@api/get-user-balance';
import { getStakingItemApi } from '@api/staking/get-staking-item.api';
import { getUserInfoApi } from '@api/staking/get-user-info.api';
import { getUserStakingDelegate } from '@api/staking/get-user-staking-delegate.api';
import { getUserPendingReward } from '@api/staking/helpers';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL } from '@app.config';
import { StakingTabs } from '@containers/staking/item/types';
import { UsersInfoValue } from '@interfaces/stake-contract.interface';
import { RawStakingItem, StakingItem } from '@interfaces/staking.interfaces';
import { fromDecimals, isNull } from '@utils/helpers';
import { MakeInterval } from '@utils/helpers/make-interval';
import { balanceMap } from '@utils/mapping/balance.map';
import { noopMap } from '@utils/mapping/noop.map';
import { mapStakeItem } from '@utils/mapping/staking.map';
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
    balance => balanceMap(balance, this.itemStore.data?.stakedToken)
  );

  userInfoStore = new LoadingErrorData<Nullable<UsersInfoValue>, Nullable<UsersInfoValue>>(
    null,
    async () => await this.getUserInfo(),
    noopMap
  );

  userStakingDelegateStore = new LoadingErrorData<Nullable<string>, Nullable<string>>(
    null,
    async () => await this.getUserStakingDelegate(),
    noopMap
  );

  currentTab: StakingTabs = StakingTabs.stake;

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

      stakeItem: computed
    });
    this.clearBalance();
  }

  get stakeItem(): Nullable<StakingItem> {
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

  private async getUserStakingDelegate() {
    const { tezos, authStore } = this.rootStore;
    const { data: item } = this.itemStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(item)) {
      return null;
    }

    return await getUserStakingDelegate(tezos, authStore.accountPkh, item.id);
  }
}
