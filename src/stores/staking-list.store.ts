import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { defined } from '@utils/helpers';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

const ZERO_AMOUNT = 0;

export class StakingListStore {
  listStore = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => await getStakingListApi(this.rootStore.authStore.accountPkh, defined(this.rootStore.tezos)),
    mapStakesItems
  );

  statsStore = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  get pendingRewards() {
    const rewardsInUsd = this.listStore.data.map(({ earnBalance, earnExchangeRate }) =>
      earnBalance?.multipliedBy(earnExchangeRate)
    );

    return (
      rewardsInUsd.reduce(
        (prevValue, currentValue) => prevValue?.plus(currentValue ?? ZERO_AMOUNT),
        new BigNumber(ZERO_AMOUNT)
      ) ?? null
    );
  }

  constructor(private rootStore: RootStore) {}
}
