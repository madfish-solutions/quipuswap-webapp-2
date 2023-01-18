import BigNumber from 'bignumber.js';
import { computed, makeObservable, observable } from 'mobx';

import { FARMS_LIST_REWARD_UPDATE_INTERVAL, ZERO_AMOUNT_BN } from '@config/constants';
import { getFarmingListCommonApi, getFarmingListUserBalances } from '@modules/farming/api';
import {
  FarmingListBalancesModel,
  FarmingListItemBalancesModel,
  FarmingListItemModel,
  FarmingListResponseModel
} from '@modules/farming/models';
import {
  defined,
  getSumOfNumbers,
  getTokenSlug,
  isEmptyArray,
  MakeInterval,
  multipliedIfPossible,
  toRealIfPossible
} from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token, Undefined } from '@shared/types';

import { FarmingListItemWithBalances } from '../pages/list/types';

interface RewardAmount {
  amount: BigNumber;
  dollarEquivalent: Nullable<BigNumber>;
}
interface TokensReward {
  token: Token;
  staked: RewardAmount;
  claimable: RewardAmount;
}

const defaultList = {
  list: []
};

const defaultListBalances = {
  balances: [] as FarmingListItemBalancesModel[]
};

@ModelBuilder()
export class FarmingListStore {
  @Led({
    default: defaultList,
    loader: getFarmingListCommonApi,
    model: FarmingListResponseModel
  })
  readonly listStore: LoadingErrorData<FarmingListResponseModel, typeof defaultList>;

  //#region farming list balances store
  @Led({
    default: defaultListBalances,
    loader: async (self: FarmingListStore) =>
      getFarmingListUserBalances(self.rootStore.authStore.accountPkh, self.rootStore.tezos, self.list),
    model: FarmingListBalancesModel
  })
  readonly listBalancesStore: LoadingErrorData<FarmingListBalancesModel, typeof defaultListBalances>;
  //#endregion farming list balances store

  readonly updateBalancesInterval = new MakeInterval(async () => {
    if (!this.listBalancesStore.isLoading) {
      await this.listBalancesStore.load();
    }
  }, FARMS_LIST_REWARD_UPDATE_INTERVAL);

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      listStore: observable,

      list: computed
    });
  }

  makePendingRewardsLiveable() {
    this.updateBalancesInterval.start();
  }

  clearIntervals() {
    this.updateBalancesInterval.stop();
  }

  get list() {
    return this.listStore.model.list.map(({ item }) => item);
  }

  get isLoading() {
    return this.listStore.isLoading;
  }

  get farmingItemsWithBalances(): FarmingListItemWithBalances[] {
    return isEmptyArray(this.listBalances) ? this.list : this.listBalances;
  }

  get listBalances(): FarmingListItemWithBalances[] {
    const { balances } = this.listBalancesStore.model;

    return balances
      .map(balance => ({
        balance,
        farmingItemModel: this.getFarmingItemModelById(balance.id, balance.contractAddress)
      }))
      .map(({ balance, farmingItemModel }) => {
        const myBalance = toRealIfPossible(balance.myBalance, farmingItemModel?.stakedToken);
        const depositBalance = toRealIfPossible(balance.depositBalance, farmingItemModel?.stakedToken);
        const earnBalance = toRealIfPossible(balance.earnBalance, farmingItemModel?.rewardToken);
        const fullRewardBalance = toRealIfPossible(balance.fullRewardBalance, farmingItemModel?.rewardToken);

        return {
          ...balance,
          ...defined(farmingItemModel, balance.id),
          myBalance,
          depositBalance,
          earnBalance,
          fullRewardBalance
        };
      });
  }

  get rewards() {
    return this.farmingItemsWithBalances
      .filter(
        ({ earnBalance, fullRewardBalance, rewardToken }) =>
          (earnBalance?.gt(ZERO_AMOUNT_BN) || fullRewardBalance?.gt(ZERO_AMOUNT_BN)) && rewardToken
      )
      .map(({ earnBalance, fullRewardBalance, rewardToken, contractAddress, id, version, earnExchangeRate }) => ({
        earnBalance,
        earnBalanceUsd: multipliedIfPossible(earnBalance, earnExchangeRate),
        earnExchangeRate,
        fullRewardBalance,
        fullRewardUsd: multipliedIfPossible(fullRewardBalance, earnExchangeRate),
        rewardToken,
        contractAddress,
        id,
        version
      }));
  }

  get claimablePendingRewardsInUsd() {
    if (this.listStore.isReady && this.listBalancesStore.isReady) {
      return getSumOfNumbers(this.rewards.map(({ earnBalanceUsd }) => earnBalanceUsd ?? null));
    }

    return null;
  }

  get totalPendingRewardsInUsd() {
    if (this.listStore.isReady && this.listBalancesStore.isReady) {
      return getSumOfNumbers(this.rewards.map(({ fullRewardUsd }) => fullRewardUsd ?? null));
    }

    return null;
  }

  get tokensRewardList(): TokensReward[] {
    return this.rewards.reduce<TokensReward[]>((rewardsSum, reward) => {
      const matchingReward = rewardsSum.find(({ token }) => getTokenSlug(token) === getTokenSlug(reward.rewardToken));

      if (matchingReward) {
        matchingReward.staked.amount = matchingReward.staked.amount.plus(reward.fullRewardBalance ?? ZERO_AMOUNT_BN);
        matchingReward.staked.dollarEquivalent =
          matchingReward.staked.dollarEquivalent?.plus(reward.fullRewardUsd ?? ZERO_AMOUNT_BN) ?? null;
        matchingReward.claimable.amount = matchingReward.claimable.amount.plus(reward.earnBalance ?? ZERO_AMOUNT_BN);
        matchingReward.claimable.dollarEquivalent =
          matchingReward.claimable.dollarEquivalent?.plus(reward.earnBalanceUsd ?? ZERO_AMOUNT_BN) ?? null;
      } else {
        rewardsSum.push({
          token: reward.rewardToken,
          staked: {
            amount: reward.fullRewardBalance ?? ZERO_AMOUNT_BN,
            dollarEquivalent: reward.fullRewardUsd ?? null
          },
          claimable: {
            amount: reward.earnBalance ?? ZERO_AMOUNT_BN,
            dollarEquivalent: reward.earnBalanceUsd ?? null
          }
        });
      }

      return rewardsSum;
    }, []);
  }

  getFarmingItemModelById(id: string, contractAddress?: string): Nullable<FarmingListItemModel> {
    return (this.listStore.model as FarmingListResponseModel).getFarmingItemModelById?.(id, contractAddress);
  }

  getFarmingItemBalancesModelById(id: string): Undefined<FarmingListItemBalancesModel> {
    return (this.listBalancesStore.model as FarmingListBalancesModel).getFarmingItemBalancesModelById?.(id);
  }
}
