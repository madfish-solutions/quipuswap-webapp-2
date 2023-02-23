import BigNumber from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { getUserTokenBalance } from '@blockchain';
import {
  FARM_REWARD_UPDATE_INTERVAL,
  FARM_USER_INFO_UPDATE_INTERVAL,
  LAST_INDEX,
  ZERO_AMOUNT_BN
} from '@config/constants';
import { DexLink } from '@modules/liquidity/helpers';
import { getLastElement, isExist, isNull, MakeInterval, toAtomic, toReal, toRealIfPossible } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { BackendYouvesFarmingApi } from '../api/backend/youves-farming.api';
import { BlockchainYouvesFarmingApi } from '../api/blockchain/youves-farming.api';
import { V3PoolType } from '../dto';
import { calculateYouvesFarmingRewards } from '../helpers';
import { FarmVersion } from '../interfaces';
import { YouvesFarmingItemResponseModel, YouvesStakeModel, YouvesStakesResponseModel } from '../models';
import { YouvesContractBalanceModel } from '../models/youves-contract-balance';

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
    loader: async self => await BackendYouvesFarmingApi.getYouvesFarmingItem(self.id, self.version),
    model: YouvesFarmingItemResponseModel
  })
  readonly itemStore: LoadingErrorData<YouvesFarmingItemResponseModel, typeof DEFAULT_ITEM>;

  get item() {
    const { item } = this.itemStore.model;
    const currentStakeRealBalance = toRealIfPossible(this.currentStakeBalance, item?.stakedToken);

    return (
      item && {
        ...item,
        tvlInStakedToken: BigNumber.maximum(item.tvlInStakedToken, currentStakeRealBalance ?? ZERO_AMOUNT_BN),
        staked: BigNumber.maximum(item.staked, this.currentStakeBalance ?? ZERO_AMOUNT_BN)
      }
    );
  }

  get investHref() {
    return this.item?.type === V3PoolType.DEX_TWO
      ? DexLink.getCpmmPoolLink(this.tokens as [Token, Token])
      : DexLink.getStableswapPoolLink(new BigNumber(this.item?.stableswapPoolId ?? 0));
  }

  get farmingAddress() {
    return this.item?.contractAddress ?? null;
  }

  get itemApiError() {
    return this.itemStore.error;
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
    if (
      !isExist(getLastElement(this.stakes)) ||
      isNull(this.item) ||
      isNull(this.contractBalance) ||
      isNull(this.version)
    ) {
      this.claimableRewards = DEFAULT_REWARDS.claimableReward;
      this.longTermRewards = DEFAULT_REWARDS.longTermReward;

      return;
    }

    const { claimableReward, fullReward } = calculateYouvesFarmingRewards(
      this.item,
      this.version,
      this.contractBalance,
      this.currentStake,
      Date.now(),
      toAtomic(this.item.dailyDistribution, this.item.rewardToken)
    );

    this.claimableRewards = toReal(claimableReward, this.item.rewardToken);
    this.longTermRewards = toReal(fullReward, this.item.rewardToken);
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

    const balance = (await getUserTokenBalance(tezos, this.farmingAddress, rewardToken)) ?? ZERO_AMOUNT_BN;

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
