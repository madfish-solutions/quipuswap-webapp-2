import { Nullable } from '@quipuswap/ui-kit';

import { RawStakeStats, RawStakingItem, StakeStats, StakingItem } from '@interfaces/staking.interfaces';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';

export class StakingListStore {
  list = new LoadingErrorData<RawStakingItem[], StakingItem[]>([], mapStakesItems);
  stats = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, mapStakeStats);

  constructor(private rootStore: RootStore) {}
}
