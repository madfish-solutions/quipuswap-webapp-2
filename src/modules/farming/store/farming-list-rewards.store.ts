import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { FARM_REWARD_UPDATE_INTERVAL, ZERO_AMOUNT } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import {
  defined,
  getSumOfNumbers,
  getTokenSlug,
  getUniqArray,
  isEmptyArray,
  isExist,
  isNull,
  isTokenEqual,
  MakeInterval,
  multipliedIfPossible,
  toReal
} from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token, Undefined } from '@shared/types';

import { getAllFarmsUserInfoApi } from '../api';
import {
  getEndTimestamp,
  getIsHarvestAvailable,
  getRewardsInUsd,
  getUserInfoLastStakedTime,
  getUserPendingReward
} from '../helpers';
import { FarmingItem } from '../interfaces';
import { FarmingListUserInfoModel, FarmingListUserInfoResponseModel } from '../models';

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

const defaultUserInfo = {
  userInfo: []
};

@ModelBuilder()
export class FarmingListRewardsStore {
  //#region farming list user info
  @Led({
    default: defaultUserInfo,
    loader: async (self: FarmingListRewardsStore) => await self.getUserInfo(),
    model: FarmingListUserInfoResponseModel
  })
  readonly _userInfo: LoadingErrorData<FarmingListUserInfoResponseModel, typeof defaultUserInfo>;
  private farmsWithBalancesIsd: Nullable<Array<BigNumber>> = null;

  get userInfo(): Array<FarmingListUserInfoModel> {
    return this._userInfo.model.userInfo;
  }
  //#endregion farming list user info

  getUserRewardsLogData(ids: Array<string>) {
    const userEarnBalancesInUsd = ids.map(id => {
      const { earnBalance } = defined(
        this.rootStore.farmingListStore?.getFarmingItemBalancesModelById(id),
        `getUserRewardsLogData, getFarmingItemBalancesModelById, id:${id}`
      );
      const { earnExchangeRate } = defined(
        this.rootStore.farmingListStore?.getFarmingItemModelById(id),
        `getUserRewardsLogData, getFarmingItemModelById, id:${id}`
      );

      return (earnBalance && earnBalance.multipliedBy(earnExchangeRate ?? ZERO_AMOUNT)) ?? null;
    });

    return getSumOfNumbers(userEarnBalancesInUsd);
  }

  claimablePendingRewardsInUsd: Nullable<BigNumber> = null;
  totalPendingRewardsInUsd: Nullable<BigNumber> = null;
  tokensRewardList: Array<TokensReward> = [];

  get claimablePendingRewards() {
    return getSumOfNumbers(this.tokensRewardList.map(({ claimable }) => claimable.amount));
  }

  readonly updateUserInfoInterval = new MakeInterval(
    async () => await this._userInfo.load(),
    FARM_REWARD_UPDATE_INTERVAL
  );

  readonly pendingRewardsInterval = new MakeInterval(() => this.updatePendingRewards(), FARM_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      claimablePendingRewardsInUsd: observable,
      totalPendingRewardsInUsd: observable,
      tokensRewardList: observable,

      updatePendingRewards: action,

      claimablePendingRewards: computed,
      isLoading: computed
    });
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const { list } = this.rootStore.farmingListStore ?? {};

    if (isNull(tezos) || isNull(authStore.accountPkh) || !isExist(list)) {
      return defaultUserInfo;
    }

    const userInfo = await getAllFarmsUserInfoApi(tezos, authStore.accountPkh, this.farmsWithBalancesIsd);

    if (isNull(this.farmsWithBalancesIsd)) {
      this.farmsWithBalancesIsd = userInfo.filter(info => info.staked.gt(ZERO_AMOUNT)).map(item => item.id);
    }

    return { userInfo };
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

  findUserInfo(id: Undefined<string>) {
    return this.userInfo?.find(_userInfo => id === _userInfo.id.toFixed()) || null;
  }

  updatePendingRewards() {
    if (!this.rootStore.farmingListStore) {
      return;
    }
    const { listBalances } = this.rootStore.farmingListStore;

    const isBalanceLoaded = listBalances.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || isEmptyArray(this.userInfo)) {
      this.totalPendingRewardsInUsd = null;
      this.claimablePendingRewardsInUsd = null;
      this.tokensRewardList = [];
    } else {
      const stakedFarmingsIds = listBalances
        .filter(({ earnBalance }) => earnBalance?.gt(ZERO_AMOUNT))
        .map(({ id }) => id);

      const claimableFarmingsIds = this.getClimableFarmings(stakedFarmingsIds);
      const totalRewardsInUsd = stakedFarmingsIds.map(id => this.prepareRewards(id));
      const claimableRewardsInUsd = claimableFarmingsIds.map(id => this.prepareRewards(id));

      this.totalPendingRewardsInUsd = getSumOfNumbers(totalRewardsInUsd);
      this.claimablePendingRewardsInUsd = getSumOfNumbers(claimableRewardsInUsd);

      this.tokensRewardList = this.getTokensRewardList(stakedFarmingsIds);
    }
  }

  get isLoading() {
    return this._userInfo.isLoading;
  }

  private prepareRewards(id: string) {
    const farmingItemModel = this.rootStore.farmingListStore?.getFarmingItemModelById(id);

    return getRewardsInUsd(defined(farmingItemModel, 'farmingItemModel'), this.findUserInfo(id));
  }

  private getTokensRewardList(ids: Array<string>): Array<TokensReward> {
    const stakedFarmings = ids.map(id =>
      defined(this.rootStore.farmingListStore?.getFarmingItemModelById(id), `FarmingListStore: 221, id: ${id}`)
    );

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
   * All results returns in atoms
   */
  private getUniqTokensRewardSync(token: Token, timestamp: number) {
    const isBalanceLoaded = !!this.rootStore.farmingListStore?.listBalances.some(({ earnBalance }) =>
      isExist(earnBalance)
    );
    if (!isBalanceLoaded || isEmptyArray(this.userInfo)) {
      return DEFAULT_REWARDS;
    }

    const stakedFarmingsWithUniqTokenRewards = this.extractFarmsWithUniqToken(token);
    const stakedRewards = this.extractUserPendingReward(stakedFarmingsWithUniqTokenRewards, timestamp);
    const stakedRewardsWithoutFee = BigNumber.sum(...stakedRewards);

    const claimableFarmings = this.getClimableFarmings(stakedFarmingsWithUniqTokenRewards);
    const claimableRewards = this.extractUserPendingReward(claimableFarmings, timestamp);
    const claimableRewardsWithoutFee = BigNumber.sum(...claimableRewards);
    const claimableRewardsWithFee = BigNumber.sum(...claimableRewards).decimalPlaces(ZERO_AMOUNT, BigNumber.ROUND_DOWN);

    return { stakedRewardsWithoutFee, claimableRewardsWithFee, claimableRewardsWithoutFee };
  }

  private extractFarmsWithUniqToken(token: Token) {
    return (
      this.rootStore.farmingListStore?.listBalances
        .filter(({ earnBalance, id }) => {
          const farmItemModel = this.rootStore.farmingListStore?.getFarmingItemModelById(id);

          if (!farmItemModel) {
            return false;
          }
          const { rewardToken } = farmItemModel;

          return earnBalance?.gt(ZERO_AMOUNT) && rewardToken && isTokenEqual(rewardToken, token);
        })
        .map(({ id }) => id) ?? []
    );
  }

  private extractUserPendingReward(ids: Array<string>, timestamp: number) {
    return ids.map(id => {
      const userInfo = this.findUserInfo(id);

      if (!userInfo) {
        return new BigNumber(ZERO_AMOUNT);
      }

      const farm = this.rootStore.farmingListStore?.getFarmingItemModelById(id);

      return getUserPendingReward(userInfo, defined(farm, 'farm'), timestamp);
    });
  }

  private getClimableFarmings(stakedFarmingsIds: Array<string>) {
    return stakedFarmingsIds.filter(id => {
      const farmingItemModel = this.rootStore.farmingListStore?.getFarmingItemModelById(id);
      const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItemModel?.id));
      const endTimestamp = getEndTimestamp(farmingItemModel, lastStakedTime);

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
