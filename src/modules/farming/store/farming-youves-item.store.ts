import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import { FARM_REWARD_UPDATE_INTERVAL, FARM_USER_INFO_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { isNull, MakeInterval } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { BackendYouvesFarmingApi } from '../api/backend/youves-farming.api';
import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { YouvesFarmingItemResponseModel, YouvesStakesResponseModel } from '../models';
import { YouvesFormTabs } from '../pages/youves-item/types';

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
    loader: async self => await BackendYouvesFarmingApi.getYouvesFarmingItem(self.farmingAddress),
    model: YouvesFarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<YouvesFarmingItemResponseModel, typeof defaultItem>;

  get item() {
    return this.itemStore.model.item;
  }
  //#endregion item store region

  //#region stakes store
  @Led({
    default: { value: null },
    loader: async self => await self.getUserInfo(),
    model: YouvesStakesResponseModel
  })
  readonly stakesStore: LoadingErrorData<YouvesStakesResponseModel, { stakes: [] }>;

  get stakes() {
    return this.stakesStore.model.stakes;
  }
  //#endregion stakes store

  currentTab = YouvesFormTabs.stake;

  claimableRewards: Nullable<BigNumber> = null;
  longTermRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);
  readonly updateStakesInterval = new MakeInterval(async () => this.stakesStore.load(), FARM_USER_INFO_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      currentTab: observable,
      claimableRewards: observable,
      longTermRewards: observable,

      setTab: action,
      updatePendingRewards: action,

      item: computed,
      stakes: computed
    });
  }

  async getClaimableRewardsOnCurrentBlock(): Promise<Nullable<BigNumber>> {
    return null;
  }

  async getLongTermRewardsOnCurrentBlock(): Promise<Nullable<BigNumber>> {
    return null;
  }

  async makePendingRewardsLiveable() {
    this.pendingRewardsInterval.start();
    this.updateStakesInterval.start();
  }

  updatePendingRewards() {
    if (isNull(this.rootStore.authStore.accountPkh)) {
      this.claimableRewards = null;
      this.longTermRewards = null;
    }

    // TODO: implement real calculations
    this.claimableRewards = (this.claimableRewards ?? new BigNumber(ZERO_AMOUNT)).plus(1);
    this.longTermRewards = (this.longTermRewards ?? new BigNumber(ZERO_AMOUNT)).plus(2);
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateStakesInterval.stop();
  }

  setTab(tab: YouvesFormTabs) {
    this.currentTab = tab;
  }

  setFarmingAddress(farmingAddress: Nullable<string>) {
    this.farmingAddress = farmingAddress;
  }

  async getUserInfo() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.farmingAddress)) {
      return { stakes: [] };
    }

    return await BlockchainYouvesFarmingApi.getStakes(this.farmingAddress, authStore.accountPkh, tezos);
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
