import { BigNumber } from 'bignumber.js';
import { observable, makeObservable, action, computed } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { isExist, isNull, MakeInterval, saveBigNumber, toReal } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { NullableStringWrapperModel } from '@shared/models';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, WhitelistedBaker } from '@shared/types';

import { getFarmingItemApi, getUserFarmingDelegate, getUserInfoApi } from '../api';
import { getUserPendingReward } from '../helpers';
import { FarmingItemResponseModel, UsersInfoResponseModel, UserTokenBalanceModel } from '../models';
import { FarmingFormTabs } from '../pages/item/types'; //TODO
import { FarmingItemWithBalances } from '../pages/list/types';

const DEFAULT_INPUT_AMOUNT = 0;

const defaultItem = {
  item: null,
  blockInfo: null
};

const defaultAvailableBalance = {
  balance: null
};

@ModelBuilder()
export class FarmingItemStore {
  farmingId: Nullable<BigNumber> = null;
  old = true;

  //#region item store region
  @Led({
    default: defaultItem,
    loader: async self => await getFarmingItemApi(self.farmingId, self.old),
    model: FarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<FarmingItemResponseModel, typeof defaultItem>;

  get item() {
    return this.itemStore.model.item;
  }
  //#endregion item store region

  //#region available balance store
  @Led({
    default: defaultAvailableBalance,
    loader: async self => await self.getUserTokenBalance(),
    model: UserTokenBalanceModel
  })
  readonly availableBalanceStore: LoadingErrorData<UserTokenBalanceModel, typeof defaultAvailableBalance>;

  get availableBalance() {
    return this.availableBalanceStore.model.balance;
  }
  //#endregion available balance store

  //#region user info store
  @Led({
    default: { value: null },
    loader: async self => await self.getUserInfo(),
    model: UsersInfoResponseModel
  })
  readonly userInfoStore: LoadingErrorData<UsersInfoResponseModel, { value: null }>;

  get userInfo() {
    return this.userInfoStore.model.value;
  }
  //#endregion user info store

  //#region user farming delegate store
  @Led({
    default: { value: null },
    loader: async self => await self.getUserFarmingDelegate(),
    model: NullableStringWrapperModel
  })
  readonly userFarmingDelegateStore: LoadingErrorData<NullableStringWrapperModel, { value: null }>;

  get userFarmingDelegateAddress() {
    return this.userFarmingDelegateStore.model.value;
  }
  //#endregion user farming delegate store

  currentTab: FarmingFormTabs = FarmingFormTabs.stake;

  inputAmount: Nullable<BigNumber> = new BigNumber(DEFAULT_INPUT_AMOUNT);
  selectedBaker: Nullable<WhitelistedBaker> = null;

  pendingRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);
  readonly updateUserInfoInterval = new MakeInterval(
    async () => this.userInfoStore.load(),
    FARM_USER_INFO_UPDATE_INTERVAL
  );

  get farmingItem(): Nullable<FarmingItemWithBalances> {
    const stakeItem = this.item;
    const userInfo = this.userInfo;

    return (
      stakeItem && {
        ...stakeItem,
        depositBalance: userInfo && toReal(userInfo.staked, stakeItem.stakedToken),
        earnBalance: this.pendingRewards && toReal(this.pendingRewards, stakeItem.rewardToken)
      }
    );
  }

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
      setOld: action,

      availableBalance: computed,
      item: computed,
      userFarmingDelegateAddress: computed,
      userInfo: computed
    });
    this.clearBalance();
  }

  async getPendingRewardsOnCurrentBlock(): Promise<Nullable<BigNumber>> {
    const { tezos } = this.rootStore;
    const userInfo = this.userInfo;

    if (!isExist(tezos) || !isExist(userInfo) || !isExist(this.item)) {
      return null;
    }

    const blockTimestamp = (await tezos.rpc.getBlockHeader()).timestamp;
    const blockTimestampMS = new Date(blockTimestamp).getTime();

    return getUserPendingReward(userInfo, this.item, blockTimestampMS).decimalPlaces(ZERO_AMOUNT, BigNumber.ROUND_DOWN);
  }

  makePendingRewardsLiveable() {
    this.pendingRewardsInterval.start();
    this.updateUserInfoInterval.start();
  }

  updatePendingRewards() {
    const userInfo = this.userInfo;

    this.pendingRewards = userInfo && this.item && getUserPendingReward(userInfo, this.item);
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateUserInfoInterval.stop();
  }

  setTab(tab: FarmingFormTabs) {
    this.currentTab = tab;
  }

  setInputAmount(inputAmount: Nullable<BigNumber.Value>) {
    this.inputAmount = saveBigNumber(inputAmount, null);
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

  setOld(old: boolean) {
    this.old = old;
  }

  /*
    Using in the model
   */
  async getUserInfo() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.item)) {
      return { value: null };
    }

    return {
      value: await getUserInfoApi(this.item, authStore.accountPkh, tezos)
    };
  }

  async getUserTokenBalance() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.item)) {
      return defaultAvailableBalance;
    }

    return {
      balance: await getUserTokenBalance(tezos, authStore.accountPkh, this.item.stakedToken),
      token: this.item.stakedToken
    };
  }

  async getUserFarmingDelegate() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.item)) {
      return { value: null };
    }

    return {
      value: await getUserFarmingDelegate(tezos, authStore.accountPkh, this.item.id)
    };
  }
}
