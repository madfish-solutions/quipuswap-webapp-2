import BigNumber from 'bignumber.js';
import { makeObservable } from 'mobx';

import { Typed } from '@shared/decorators';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { getStableswapListApi, getStableswapStatsApi } from '../api';
import { statsMapper } from '../mapping';
import {
  RawStableswapItem,
  RawStableswapStats,
  StableswapItem,
  StableswapStats,
  StableswapTokensInfoDto
} from '../types';

class StableswapListDto implements StableswapItem {
  @Typed({ type: BigNumber })
  id!: BigNumber;

  @Typed({ type: BigNumber })
  poolId!: BigNumber;

  contractAddress!: string;

  tokensInfo!: Array<StableswapTokensInfoDto>;

  isWhitelisted!: boolean;

  @Typed({ type: BigNumber })
  totalLpSupply!: BigNumber;

  @Typed({ type: BigNumber })
  tvlInUsd!: BigNumber;

  poolContractUrl!: string;

  stableswapItemUrl!: string;

  @Typed({ type: BigNumber })
  liquidityProvidersFee!: BigNumber;

  @Typed({ type: BigNumber })
  stakersFee!: BigNumber;

  @Typed({ type: BigNumber })
  interfaceFee!: BigNumber;

  @Typed({ type: BigNumber })
  devFee!: BigNumber;

  lpToken!: Token;
}

@ModelBuilder()
export class StableswapListStore {
  @Led({ defaultData: [], getData: async () => await getStableswapListApi(), dto: StableswapListDto })
  readonly listStore!: LoadingErrorData<Array<RawStableswapItem>, Array<StableswapItem>>;

  readonly statsStore = new LoadingErrorData<RawStableswapStats, Nullable<StableswapStats>>(
    null,
    async () => await getStableswapStatsApi(),
    statsMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {});
  }

  get stats() {
    return this.statsStore.data;
  }

  get list() {
    return this.rootStore.stableswapFilterStore?.filterAndSort(this.listStore.data);
  }
}
