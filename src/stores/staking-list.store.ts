import { Nullable } from '@quipuswap/ui-kit';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

export class StakingListStore {
  listStore = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => getStakingListApi(this.rootStore.authStore.accountPkh),
    mapStakesItems
  );

  statsStore = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  constructor(private rootStore: RootStore) {}
}
