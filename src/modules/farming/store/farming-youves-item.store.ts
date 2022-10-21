import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import {
  FARM_REWARD_UPDATE_INTERVAL,
  FARM_USER_INFO_UPDATE_INTERVAL,
  LAST_INDEX,
  ZERO_AMOUNT
} from '@config/constants';
import { isNull, MakeInterval } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Token } from '@shared/types';

import { BackendYouvesFarmingApi } from '../api/backend/youves-farming.api';
import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { YouvesFarmingItemResponseModel, YouvesStakeModel, YouvesStakesResponseModel } from '../models';

const DEFAULT_ITEM = {
  item: null,
  blockInfo: null
};

const DEFAULT_TOKENS: Token[] = [];

@ModelBuilder()
export class FarmingYouvesItemStore {
  farmingAddress: Nullable<string> = null;

  //#region item store region
  @Led({
    default: DEFAULT_ITEM,
    loader: async self => await BackendYouvesFarmingApi.getYouvesFarmingItem(self.farmingAddress),
    model: YouvesFarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<YouvesFarmingItemResponseModel, typeof DEFAULT_ITEM>;

  get item() {
    return this.itemStore.model.item;
  }
  //#endregion item store region

  //#region stakes store
  @Led({
    default: { stakes: [] },
    loader: async self => await self.getStakes(),
    model: YouvesStakesResponseModel
  })
  readonly stakesStore: LoadingErrorData<YouvesStakesResponseModel, { stakes: YouvesStakeModel[] }>;

  get stakes(): YouvesStakeModel[] {
    return this.stakesStore.model.stakes ?? [];
  }
  //#endregion stakes store

  claimableRewards: Nullable<BigNumber> = null;
  longTermRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);
  readonly updateStakesInterval = new MakeInterval(async () => this.stakesStore.load(), FARM_USER_INFO_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      claimableRewards: observable,
      longTermRewards: observable,

      updatePendingRewards: action,

      item: computed,
      stakes: computed
    });
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

  setFarmingAddress(farmingAddress: Nullable<string>) {
    this.farmingAddress = farmingAddress;
  }

  /*
    Using in the stakesStore
   */
  async getStakes() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(this.farmingAddress)) {
      return { stakes: [] };
    }

    return await BlockchainYouvesFarmingApi.getStakes(this.farmingAddress, authStore.accountPkh, tezos);
  }

  get currentStake() {
    return this.stakes.at(LAST_INDEX) ?? null;
  }

  get currentStakeBalance() {
    return this.currentStake?.stake ?? null;
  }

  get currentStakeId() {
    const NEW_STAKE = 0;
    const FALLBACK_STAKE_ID = new BigNumber(NEW_STAKE);

    return this.currentStake?.id ?? FALLBACK_STAKE_ID;
  }

  get tokens() {
    return this.item?.tokens ?? DEFAULT_TOKENS;
  }
}
