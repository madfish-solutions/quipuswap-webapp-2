import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserBalance } from '@blockchain';
import {
  FARM_REWARD_UPDATE_INTERVAL,
  FARM_USER_INFO_UPDATE_INTERVAL,
  LAST_INDEX,
  MS_IN_SECOND,
  PRECISION_FACTOR,
  ZERO_AMOUNT,
  ZERO_AMOUNT_BN
} from '@config/constants';
import { getLastElement, isExist, isNull, isUndefined, MakeInterval } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Standard, Token } from '@shared/types';

import { BackendYouvesFarmingApi } from '../api/backend/youves-farming.api';
import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { YouvesStakeDto } from '../dto';
import { YouvesFarmingItemResponseModel, YouvesStakeModel, YouvesStakesResponseModel } from '../models';
import { YouvesContractBalanceModel } from '../models/youves-contract-balance';
import { getRewards } from '../pages/youves-item/helpers/get-rewards';

const DEFAULT_REWARDS = {
  claimableReward: null,
  longTermReward: null
};

const DEFAULT_ITEM = {
  item: null,
  blockInfo: null
};

const DEFAULT_CONTRACT_BALANCE = { balance: ZERO_AMOUNT_BN };

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

  //#region stakes store
  @Led({
    default: DEFAULT_CONTRACT_BALANCE,
    loader: async self => await self.getContractBalance(),
    model: YouvesContractBalanceModel
  })
  readonly contractBalanceStore: LoadingErrorData<YouvesContractBalanceModel, typeof DEFAULT_CONTRACT_BALANCE>;

  get contractBalance() {
    return this.contractBalanceStore.model.balance;
  }
  //#endregion stakes store

  claimableRewards: Nullable<BigNumber> = null;
  longTermRewards: Nullable<BigNumber> = null;
  readonly pendingRewardsInterval = new MakeInterval(
    async () => this.updatePendingRewards(),
    FARM_REWARD_UPDATE_INTERVAL
  );
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

  async updatePendingRewards() {
    const { tezos } = this.rootStore;

    if (
      !isExist(getLastElement(this.stakes)) ||
      !isExist(this.itemStore.model.item) ||
      !isExist(this.contractBalance) ||
      isNull(tezos) ||
      isNull(this.farmingAddress)
    ) {
      return DEFAULT_REWARDS;
    }

    let _disc_factor;

    const item = this.itemStore.model.item;
    const { depositToken, lastRewards, vestingPeriodSeconds, staked, discFactor } = item;

    if (staked.isGreaterThan(ZERO_AMOUNT)) {
      const reward = this.contractBalance.minus(lastRewards);
      _disc_factor = discFactor.plus(reward.multipliedBy(PRECISION_FACTOR).dividedToIntegerBy(staked));
    }

    if (isUndefined(_disc_factor)) {
      return DEFAULT_REWARDS;
    }

    const stakes = getLastElement(this.stakes) as YouvesStakeDto;

    const { claimable_reward, full_reward } = getRewards(
      stakes,
      vestingPeriodSeconds.multipliedBy(MS_IN_SECOND),
      _disc_factor
    );
    const tokenDecimals = depositToken.metadata.decimals;
    const tokenPrecision = `1e${tokenDecimals}`;

    this.claimableRewards = claimable_reward.dividedBy(tokenPrecision);
    this.longTermRewards = full_reward.dividedBy(tokenDecimals);
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

  async getContractBalance() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.farmingAddress) || !isExist(this.itemStore.model.item)) {
      return DEFAULT_CONTRACT_BALANCE;
    }

    const item = this.itemStore.model.item;
    const { rewardToken } = item;
    const balance =
      (await getUserBalance(
        tezos,
        this.farmingAddress,
        rewardToken.contractAddress,
        Standard.Fa2,
        rewardToken.fa2TokenId
      )) ?? ZERO_AMOUNT_BN;

    return {
      balance
    };
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
