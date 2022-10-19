import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { isNull, MakeInterval, saveBigNumber } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { YouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { UserTokenBalanceModel, YouvesFarmingItemResponseModel, YouvesUsersInfoModel } from '../models';
import { YouvesFormTabs } from '../pages/youves-item/types';

const DEFAULT_INPUT_AMOUNT = 0;

const defaultItem = {
  item: null,
  blockInfo: null
};

const defaultAvailableBalance = {
  balance: null
};

@ModelBuilder()
export class FarmingYouvesItemStore {
  farmingAddress: Nullable<string> = null;

  //#region item store region
  @Led({
    default: defaultItem,
    loader: async self => await YouvesFarmingApi.getItem(self.farmingAddress),
    model: YouvesFarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<YouvesFarmingItemResponseModel, typeof defaultItem>;

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
    model: YouvesUsersInfoModel
  })
  readonly userInfoStore: LoadingErrorData<YouvesUsersInfoModel, { stakes: [] }>;

  get userInfo() {
    return this.userInfoStore.model;
  }
  //#endregion user info store

  currentTab = YouvesFormTabs.stake;
  inputAmount: Nullable<BigNumber> = new BigNumber(DEFAULT_INPUT_AMOUNT);

  claimableRewards: Nullable<BigNumber> = null;
  longTermRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);
  readonly updateUserInfoInterval = new MakeInterval(
    async () => this.userInfoStore.load(),
    FARM_USER_INFO_UPDATE_INTERVAL
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      inputAmount: observable,
      claimableRewards: observable,
      longTermRewards: observable,

      setTab: action,
      clearBalance: action,
      setInputAmount: action,
      updatePendingRewards: action,

      availableBalance: computed,
      item: computed,
      userInfo: computed
    });
    this.clearBalance();
  }

  async getClaimableRewardsOnCurrentBlock(): Promise<Nullable<BigNumber>> {
    return null;
  }

  async getLongTermRewardsOnCurrentBlock(): Promise<Nullable<BigNumber>> {
    return null;
  }

  async makePendingRewardsLiveable() {
    this.pendingRewardsInterval.start();
    this.updateUserInfoInterval.start();
  }

  updatePendingRewards() {
    // TODO: implement real calculations
    this.claimableRewards = (this.claimableRewards ?? new BigNumber(ZERO_AMOUNT)).plus(1);
    this.longTermRewards = (this.longTermRewards ?? new BigNumber(ZERO_AMOUNT)).plus(2);
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateUserInfoInterval.stop();
  }

  setTab(tab: YouvesFormTabs) {
    this.currentTab = tab;
  }

  setInputAmount(inputAmount: Nullable<BigNumber.Value>) {
    this.inputAmount = saveBigNumber(inputAmount, null);
  }

  clearBalance() {
    this.setInputAmount(DEFAULT_INPUT_AMOUNT);
  }

  setFarmingAddress(farmingAddress: Nullable<string>) {
    this.farmingAddress = farmingAddress;
  }

  async getUserInfo() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.item)) {
      return { stakes: [] };
    }

    return await YouvesFarmingApi.getUserInfo(this.item, authStore.accountPkh, tezos);
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
}
