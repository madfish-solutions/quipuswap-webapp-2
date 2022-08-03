import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { FARM_REWARD_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import {
  isExist,
  isNull,
  MakeInterval,
  isTokenEqual,
  getUniqArray,
  getTokenSlug,
  multipliedIfPossible,
  toReal
} from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { getAllFarmsUserInfoApi, getFarmingListApi, getFarmingStatsApi } from '../api';
import {
  getRewardsInUsd,
  getEndTimestamp,
  getPendingRewards,
  UsersInfoValueWithId,
  getIsHarvestAvailable,
  getUserInfoLastStakedTime,
  getUserPendingRewardWithFee
} from '../helpers';
import { FarmingItem, FarmingStats, RawFarmingItem, RawFarmingStats } from '../interfaces';
import { mapFarmingItems, mapFarmingStats } from '../mapping';

const ZERO_BN = new BigNumber(ZERO_AMOUNT);

interface RewardAmount {
  amount: BigNumber;
  dollarEquivalent: Nullable<BigNumber>;
}
interface TokensReward {
  token: Token;
  staked: RewardAmount;
  claimable: RewardAmount;
}

const DEFAULT_REWARDS = {
  stakedRewardsWithoutFee: new BigNumber(ZERO_AMOUNT),
  claimableRewardsWithFee: new BigNumber(ZERO_AMOUNT),
  claimableRewardsWithoutFee: new BigNumber(ZERO_AMOUNT)
};

export class FarmingListStore {
  readonly listStore = new LoadingErrorData<RawFarmingItem[], FarmingItem[]>(
    [],
    async () => await getFarmingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapFarmingItems
  );

  readonly userInfo = new LoadingErrorData<Nullable<UsersInfoValueWithId[]>, Nullable<UsersInfoValueWithId[]>>(
    [],
    async () => await this.getUserInfo(),
    noopMap
  );

  readonly statsStore = new LoadingErrorData<RawFarmingStats, Nullable<FarmingStats>>(
    null,
    getFarmingStatsApi,
    mapFarmingStats
  );

  claimablePendingRewards: Nullable<BigNumber> = null;
  totalPendingRewards: Nullable<BigNumber> = null;
  tokensRewardList: Array<TokensReward> = [];

  readonly updateUserInfoInterval = new MakeInterval(
    async () => await this.userInfo.load(),
    FARM_REWARD_UPDATE_INTERVAL
  );
  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      claimablePendingRewards: observable,
      totalPendingRewards: observable,
      tokensRewardList: observable,
      list: computed,

      updatePendingRewards: action
    });
  }

  get list() {
    return this.rootStore.farmingFilterStore?.filterAndSort(this.listStore.data);
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { data: list } = this.listStore;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(list)) {
      return null;
    }

    return await getAllFarmsUserInfoApi(tezos, authStore.accountPkh);
  }

  async getQuipuPendingRewards() {
    return (await this.getUniqTokensRewardForLastBlock(QUIPU_TOKEN)).claimableRewardsWithFee;
  }

  makePendingRewardsLiveable() {
    this.updateUserInfoInterval.start();
    this.pendingRewardsInterval.start();
  }

  clearIntervals() {
    this.updateUserInfoInterval.stop();
    this.pendingRewardsInterval.stop();
  }

  findUserInfo(farmingItem: FarmingItem) {
    // @ts-ignore
    return this.userInfo.data?.find(_userInfo => farmingItem.id.eq(_userInfo.id[0])) || null;
  }

  updatePendingRewards() {
    const isBalanceLoaded = this.listStore.data.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || !this.userInfo.data) {
      this.totalPendingRewards = null;
      this.claimablePendingRewards = null;
      this.tokensRewardList = [];
    } else {
      const stakedFarmings = this.listStore.data.filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT));

      const claimableFarmings = this.getClimableFarmings(stakedFarmings);

      const totalRewardsInUsd = stakedFarmings.map(farmingItem =>
        getRewardsInUsd(farmingItem, this.findUserInfo(farmingItem))
      );

      const claimableRewardsInUsd = claimableFarmings.map(farmingItem =>
        getRewardsInUsd(farmingItem, this.findUserInfo(farmingItem))
      );

      this.totalPendingRewards = getPendingRewards(totalRewardsInUsd);
      this.claimablePendingRewards = getPendingRewards(claimableRewardsInUsd);
      this.tokensRewardList = this.getTokensRewardList(stakedFarmings);
    }
  }

  private getTokensRewardList(stakedFarmings: Array<FarmingItem>): Array<TokensReward> {
    const uniqTokens = getUniqArray(stakedFarmings, ({ rewardToken }) => getTokenSlug(rewardToken)).map(
      ({ rewardToken, earnExchangeRate }) => ({ rewardToken, earnExchangeRate })
    );

    return uniqTokens.map(this.tokensRewardMapper.bind(this));
  }

  private tokensRewardMapper({ rewardToken, earnExchangeRate }: Pick<FarmingItem, 'rewardToken' | 'earnExchangeRate'>) {
    const { claimableRewardsWithoutFee, stakedRewardsWithoutFee } = this.getUniqTokensRewardSync(
      rewardToken,
      Date.now()
    );

    const correctClaimableRewardsWithoutFee = claimableRewardsWithoutFee.isNaN() ? ZERO_BN : claimableRewardsWithoutFee;

    const realClaimableAmount = toReal(correctClaimableRewardsWithoutFee, rewardToken);
    const claimableDollarEquivalent = multipliedIfPossible(realClaimableAmount, earnExchangeRate);

    const realStakedAmount = toReal(stakedRewardsWithoutFee, rewardToken);
    const skatedDollarEquivalent = multipliedIfPossible(realStakedAmount, earnExchangeRate);

    return {
      token: rewardToken,
      staked: {
        amount: realStakedAmount,
        dollarEquivalent: skatedDollarEquivalent
      },
      claimable: {
        amount: realClaimableAmount,
        dollarEquivalent: claimableDollarEquivalent
      }
    };
  }

  /**
   * All results retuns in atoms
   */
  private getUniqTokensRewardSync(token: Token, timestamp: number) {
    const isBalanceLoaded = this.listStore.data.some(({ earnBalance }) => isExist(earnBalance));
    if (!isBalanceLoaded || !this.userInfo.data) {
      return DEFAULT_REWARDS;
    }

    const stakedFarmingsWithUniqTokenRewards = this.extractFarmsWithUniqToken(token);
    const stakedRewards = this.extractUserPendingReward(stakedFarmingsWithUniqTokenRewards, timestamp);
    const stakedRewardsWithoutFee = BigNumber.sum(...stakedRewards.map(({ withoutFee }) => withoutFee));

    const claimableFarmings = this.getClimableFarmings(stakedFarmingsWithUniqTokenRewards);
    const claimableRewards = this.extractUserPendingReward(claimableFarmings, timestamp);
    const claimableRewardsWithoutFee = BigNumber.sum(...claimableRewards.map(({ withoutFee }) => withoutFee));
    const claimableRewardsWithFee = BigNumber.sum(...claimableRewards.map(({ withFee }) => withFee)).decimalPlaces(
      ZERO_AMOUNT,
      BigNumber.ROUND_DOWN
    );

    return { stakedRewardsWithoutFee, claimableRewardsWithFee, claimableRewardsWithoutFee };
  }

  private extractFarmsWithUniqToken(token: Token) {
    return this.listStore.data.filter(
      ({ earnBalance, rewardToken }) => earnBalance?.gt(ZERO_AMOUNT) && rewardToken && isTokenEqual(rewardToken, token)
    );
  }

  private extractUserPendingReward(farmings: FarmingItem[], timestamp: number) {
    return farmings.map(farm => {
      const userInfo = this.findUserInfo(farm);

      if (!userInfo) {
        return { withFee: new BigNumber(ZERO_AMOUNT), withoutFee: new BigNumber(ZERO_AMOUNT) };
      }

      return getUserPendingRewardWithFee(userInfo, farm, timestamp);
    });
  }

  private getClimableFarmings(stakedFarmings: FarmingItem[]) {
    return stakedFarmings.filter(farmingItem => {
      const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItem));
      const endTimestamp = getEndTimestamp(farmingItem, lastStakedTime);

      return getIsHarvestAvailable(endTimestamp);
    });
  }

  private async getUniqTokensRewardForLastBlock(token: Token) {
    const { tezos } = this.rootStore;
    if (!tezos) {
      return DEFAULT_REWARDS;
    }

    const blockTimestamp = (await tezos.rpc.getBlockHeader()).timestamp;
    const blockTimestampMS = new Date(blockTimestamp).getTime();

    return this.getUniqTokensRewardSync(token, blockTimestampMS);
  }
}
