import { Nullable } from '@quipuswap/ui-kit';

import { getStakingListApi } from '@api/staking/get-staking-list.api';
import { getStakingStatsApi } from '@api/staking/get-staking-stats.api';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

export class StakingListStore {
  list = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => getStakingListApi(this.rootStore.authStore.accountPkh),
    mapStakesItems
  );
  stats = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  constructor(private rootStore: RootStore) {}
}
