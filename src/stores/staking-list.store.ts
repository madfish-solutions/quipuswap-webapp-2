import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { multipliedIfPossible } from '@utils/helpers/multiplied-if-possible';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const ZERO_AMOUNT = 0;

export class StakingListStore {
  listStore = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => await getStakingListApi(this.rootStore.authStore.accountPkh, this.rootStore.tezos),
    mapStakesItems
  );

  statsStore = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  get pendingRewards() {
    const rewardsInUsd = this.listStore.data.map(({ earnBalance, earnExchangeRate }) =>
      multipliedIfPossible(earnBalance, earnExchangeRate)
    );

    return rewardsInUsd.reduce<BigNumber>(
      (prevValue, currentValue) => prevValue.plus(currentValue ?? ZERO_AMOUNT),
      new BigNumber(ZERO_AMOUNT)
    );
  }

  get list() {
    return this.rootStore.stakingFilterStore.filterAndSort(this.listStore.data);
  }

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      pendingRewards: computed,
      list: computed
    });
  }
}
