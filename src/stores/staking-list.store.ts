import { Nullable } from '@quipuswap/ui-kit';

import { getStakingListApi, getStakingStatsApi } from '@api/staking';
import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { defined } from '@utils/helpers';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

export class StakingListStore {
  listStore = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => await getStakingListApi(this.rootStore.authStore.accountPkh, defined(this.rootStore.tezos)),
    mapStakesItems
  );

  statsStore = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);

  constructor(private rootStore: RootStore) {}
}
