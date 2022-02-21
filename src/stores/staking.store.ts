import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { getStakingListApi } from '@api/staking/get-staking-list.api';
import { getStakingStatsApi } from '@api/staking/get-staking-stats.api';
import { RawStakingItem, RawStakeStats, StakingItem, StakeStats } from '@interfaces/staking.interfaces';
import { mapStakesItems, mapStakeStats } from '@utils/mapping/staking.map';

import { LoadingErrorData } from './loading-error-data.store';
import { RootStore } from './root.store';
import { StakingFormStore } from './staking-form.store';

export class StakingStore {
  list = new LoadingErrorData<RawStakingItem[], StakingItem[]>(
    [],
    async () => getStakingListApi(this.rootStore.authStore.accountPkh),
    mapStakesItems
  );
  stats = new LoadingErrorData<RawStakeStats, Nullable<StakeStats>>(null, getStakingStatsApi, mapStakeStats);
  form: StakingFormStore;

  constructor(private rootStore: RootStore) {
    this.form = new StakingFormStore(this.rootStore);
  }

  async loadStakeItem(stakingId: BigNumber) {
    const stakeItem = this.list.data.find(({ id }) => stakingId.eq(id)) || null;
    this.form.setStakeItem(stakeItem);
    await this.form.loadAvailableBalance();
  }
}
