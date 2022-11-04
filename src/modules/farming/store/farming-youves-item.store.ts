import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserBalance } from '@blockchain';
import {
  FARM_REWARD_UPDATE_INTERVAL,
  FARM_USER_INFO_UPDATE_INTERVAL,
  LAST_INDEX,
  PRECISION_FACTOR,
  ZERO_AMOUNT_BN
} from '@config/constants';
import { getLastElement, isExist, isNull, MakeInterval, toReal } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Standard, Token } from '@shared/types';

import { BackendYouvesFarmingApi } from '../api/backend/youves-farming.api';
import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { YouvesStakeDto } from '../dto';
import { FarmVersion } from '../interfaces';
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

const DEFAULT_CONTRACT_BALANCE = { balance: null };

const DEFAULT_TOKENS: Token[] = [];

@ModelBuilder()
export class FarmingYouvesItemStore {
  id = '0';
  version: Nullable<FarmVersion> = null;

  //#region item store region
  @Led({
    default: DEFAULT_ITEM,
    loader: async self => await BackendYouvesFarmingApi.getYouvesFarmingItem(self.id),
    model: YouvesFarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<YouvesFarmingItemResponseModel, typeof DEFAULT_ITEM>;

  get item() {
    return this.itemStore.model.item;
  }

  get farmingAddress() {
    return this.item?.contractAddress ?? null;
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
      id: observable,
      claimableRewards: observable,
      longTermRewards: observable,

      updatePendingRewards: action,
      setFarmingId: action,

      item: computed,
      stakes: computed,
      contractBalance: computed
    });
  }

  async makePendingRewardsLiveable() {
    this.pendingRewardsInterval.start();
    this.updateStakesInterval.start();
  }

  async updatePendingRewards() {
    if (!isExist(getLastElement(this.stakes)) || isNull(this.item) || isNull(this.contractBalance)) {
      this.claimableRewards = DEFAULT_REWARDS.claimableReward;
      this.longTermRewards = DEFAULT_REWARDS.longTermReward;

      return;
    }

    const { lastRewards, vestingPeriodSeconds, staked, discFactor, rewardToken } = this.item;

    if (staked.isZero()) {
      this.claimableRewards = ZERO_AMOUNT_BN;
      this.longTermRewards = ZERO_AMOUNT_BN;

      return;
    }

    const reward = this.contractBalance.minus(lastRewards);
    const newDiscFactor = discFactor.plus(reward.multipliedBy(PRECISION_FACTOR).dividedToIntegerBy(staked));

    const stake = getLastElement(this.stakes) as YouvesStakeDto;

    const { claimableReward, fullReward } = getRewards(stake, vestingPeriodSeconds, newDiscFactor);

    this.claimableRewards = toReal(claimableReward, rewardToken);
    this.longTermRewards = toReal(fullReward, rewardToken);
  }

  clearIntervals() {
    this.pendingRewardsInterval.stop();
    this.updateStakesInterval.stop();
  }

  setFarmingId(id: string) {
    this.id = id;
  }

  setFarmingVersion(version: FarmVersion) {
    this.version = version;
  }

  /*
    Using in the stakesStore
   */
  async getStakes() {
    const { tezos, authStore } = this.rootStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || !isExist(this.itemStore.model.item?.contractAddress)) {
      return { stakes: [] };
    }

    return await BlockchainYouvesFarmingApi.getStakes(
      this.itemStore.model.item!.contractAddress,
      authStore.accountPkh,
      tezos
    );
  }

  // TODO: Add fa12 support when contracts will be ready
  async getContractBalance() {
    const { tezos } = this.rootStore;

    if (isNull(tezos) || isNull(this.farmingAddress) || isNull(this.itemStore.model.item)) {
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
