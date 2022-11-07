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
  saveBigNumber,
  toReal
} from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token, Undefined } from '@shared/types';

import { getAllFarmsUserInfoApi, getFarmingListApi, getFarmingListUserBalancesDeprecated } from '../api';
import {
  getEndTimestamp,
  getIsHarvestAvailable,
  getRewardsInUsd,
  getUserInfoLastStakedTime,
  getUserPendingRewardWithFee
} from '../helpers';
import { FarmingItem } from '../interfaces';
import {
  FarmingItemBalancesModel,
  FarmingItemModel,
  FarmingItemResponseModel,
  FarmingListBalancesModel,
  FarmingListResponseModel,
  UserInfoModel,
  UserInfoResponseModel
} from '../models';

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

const defaultList = {
  list: [] as Array<FarmingItemResponseModel>
};

const defaultListBalances = {
  balances: [] as Array<FarmingItemBalancesModel>
};

const defaultUserInfo = {
  userInfo: []
};

@ModelBuilder()
export class FarmingListStore {
  //#region farming list store
  @Led({
    default: defaultList,
    loader: getFarmingListApi,
    model: FarmingListResponseModel
  })
  readonly listStore: LoadingErrorData<FarmingListResponseModel, typeof defaultList>;

  //TODO: change name
  get listList() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  getFarmingItemModelById(id: string): Undefined<FarmingItemModel> {
    return (this.listStore.model as FarmingListResponseModel).getFarmingItemModelById?.(id);
  }
  //#endregion farming list store

  //#region farming list balances store
  @Led({
    default: defaultListBalances,
    loader: async (self: FarmingListStore) =>
      getFarmingListUserBalancesDeprecated(self.rootStore.authStore.accountPkh, self.rootStore.tezos, self.listList),
    model: FarmingListBalancesModel
  })
  readonly listBalancesStore: LoadingErrorData<FarmingListBalancesModel, typeof defaultListBalances>;

  get listBalances() {
    const balances = this.listBalancesStore.model.balances;

    return balances.map(balance => {
      const farmingItemModel = this.getFarmingItemModelById(balance.id);

      const myBalance =
        farmingItemModel && balance.myBalance
          ? toReal(saveBigNumber(balance.myBalance, new BigNumber('0')), farmingItemModel.stakedToken)
          : null;
      const depositBalance =
        farmingItemModel && balance.depositBalance
          ? toReal(saveBigNumber(balance.depositBalance, new BigNumber('0')), farmingItemModel.stakedToken)
          : null;
      const earnBalance =
        farmingItemModel && balance.earnBalance
          ? toReal(saveBigNumber(balance.earnBalance, new BigNumber('0')), farmingItemModel.rewardToken)
          : null;

      return {
        ...balance,
        myBalance,
        depositBalance,
        earnBalance
      };
    });
  }

  get accountPkh() {
    return this.rootStore.authStore.accountPkh;
  }

  get tezos() {
    return this.rootStore.tezos;
  }

  getFarmingItemBalancesModelById(id: string): Undefined<FarmingItemBalancesModel> {
    return (this.listBalancesStore.model as FarmingListBalancesModel).getFarmingItemBalancesModelById?.(id);
  }

  getUserRewardsLogData(ids: Array<BigNumber>) {
    const userEarnBalancesInUsd = ids.map(id => {
      const { earnBalance } = defined(
        this.getFarmingItemBalancesModelById(id.toFixed()),
        `getUserRewardsLogData, getFarmingItemBalancesModelById, id:${id.toFixed()}`
      );
      const { earnExchangeRate } = defined(
        this.getFarmingItemModelById(id.toFixed()),
        `getUserRewardsLogData, getFarmingItemModelById, id:${id.toFixed()}`
      );

      return (earnBalance && earnBalance.multipliedBy(earnExchangeRate ?? ZERO_AMOUNT)) ?? null;
    });

    return getSumOfNumbers(userEarnBalancesInUsd);
  }

  //#endregion farming list balances store

  //#region farming list user info
  @Led({
    default: defaultUserInfo,
    loader: async (self: FarmingListStore) => await self.getUserInfo(),
    model: UserInfoResponseModel
  })
  readonly _userInfo: LoadingErrorData<UserInfoResponseModel, typeof defaultUserInfo>;
  private farmsWithBalancesIsd: Nullable<Array<BigNumber>> = null;

  get userInfo(): Array<UserInfoModel> {
    return this._userInfo.model.userInfo;
  }
  //#endregion farming list user info

  get farmingItemsWithBalances() {
    if (isEmptyArray(this.listBalances)) {
      return this.listList;
    }

    return this.listBalances.map(balances => {
      const farmingItem = defined(
        this.getFarmingItemModelById(balances.id),
        `FarmingListStore: 140, id: ${balances.id}`
      );

      return { ...balances, ...farmingItem };
    });
  }

  get list() {
    //TODO: Check for accountPkh!
    //@ts-ignore
    return this.rootStore.farmingFilterStore?.filterAndSort(this.farmingItemsWithBalances);
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

      list: computed,
      listList: computed,
      listBalances: computed,
      farmingItemsWithBalances: computed,
      claimablePendingRewards: computed,
      isLoading: computed
    });
  }

  private async getUserInfo() {
    const { tezos, authStore } = this.rootStore;
    const list = this.listList;

    if (isNull(tezos) || isNull(authStore.accountPkh) || isNull(list)) {
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
    const isBalanceLoaded = this.listBalances.some(({ earnBalance }) => isExist(earnBalance));

    if (!isBalanceLoaded || isEmptyArray(this.userInfo)) {
      this.totalPendingRewardsInUsd = null;
      this.claimablePendingRewardsInUsd = null;
      this.tokensRewardList = [];
    } else {
      const stakedFarmingsIds = this.listBalances
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
    return this.listStore.isLoading;
  }

  private prepareRewards(id: string) {
    const farmingItemModel = this.getFarmingItemModelById(id);

    return getRewardsInUsd(defined(farmingItemModel, 'FarmingListStore: 217'), this.findUserInfo(id));
  }

  private getTokensRewardList(ids: Array<string>): Array<TokensReward> {
    const stakedFarmings = ids.map(id => defined(this.getFarmingItemModelById(id), `FarmingListStore: 221, id: ${id}`));

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
    const isBalanceLoaded = this.listBalances.some(({ earnBalance }) => isExist(earnBalance));
    if (!isBalanceLoaded || isEmptyArray(this.userInfo)) {
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
    return this.listBalances
      .filter(({ earnBalance, id }) => {
        const farmItemModel = this.getFarmingItemModelById(id);

        if (!farmItemModel) {
          return false;
        }
        const { rewardToken } = farmItemModel;

        return earnBalance?.gt(ZERO_AMOUNT) && rewardToken && isTokenEqual(rewardToken, token);
      })
      .map(({ id }) => id);
  }

  private extractUserPendingReward(ids: Array<string>, timestamp: number) {
    return ids.map(id => {
      const userInfo = this.findUserInfo(id);

      if (!userInfo) {
        return { withFee: new BigNumber(ZERO_AMOUNT), withoutFee: new BigNumber(ZERO_AMOUNT) };
      }

      const farm = this.getFarmingItemModelById(id);

      return getUserPendingRewardWithFee(userInfo, defined(farm, 'FarmingListStore:302'), timestamp);
    });
  }

  private getClimableFarmings(stakedFarmingsIds: Array<string>) {
    return stakedFarmingsIds.filter(id => {
      const farmingItemModel = this.getFarmingItemModelById(id);
      const lastStakedTime = getUserInfoLastStakedTime(this.findUserInfo(farmingItemModel?.id.toFixed()));
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
