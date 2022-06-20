import { BigNumber } from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { fromDecimals, isEmptyArray } from '@shared/helpers';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getStableFarmListApi, getStableFarmStatsApi, getStakerInfo } from '../api';
import { farmsListMapper, stakerInfoMapper, statsMapper } from '../mapping';
import {
  RawStableFarmItem,
  RawStableFarmStats,
  RawStakerInfo,
  StableFarmItem,
  StableFarmStats,
  StakerInfo
} from '../types';

export class StableFarmListStore {
  readonly statsStore = new LoadingErrorData<RawStableFarmStats, Nullable<StableFarmStats>>(
    null,
    async () => await getStableFarmStatsApi(),
    statsMapper
  );

  readonly listStore = new LoadingErrorData<Array<RawStableFarmItem>, Array<StableFarmItem>>(
    [],
    async () => await getStableFarmListApi(),
    farmsListMapper
  );

  readonly stakerInfo = new LoadingErrorData<Array<RawStakerInfo>, Array<RawStakerInfo>>(
    [],
    async () => await getStakerInfo(this.rootStore.tezos, this.list, this.rootStore.authStore.accountPkh),
    stakerInfoMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stats: computed,
      list: computed,
      info: computed
    });
  }

  get stats() {
    return this.statsStore.data;
  }

  get list() {
    return this.listStore.data;
  }

  //TODO: find a better way to mapping
  get info(): Array<StakerInfo> {
    if (isEmptyArray(this.stakerInfo.data) || isEmptyArray(this.list)) {
      return [];
    }

    return this.stakerInfo.data.map(({ yourReward, yourDeposit }: RawStakerInfo, infoIndex) => {
      let yourEarned = new BigNumber('0');
      const { tokensInfo } = this.list[infoIndex];

      yourReward?.forEach((value, tokenIndex) => {
        const { token, exchangeRate } = tokensInfo[tokenIndex.toNumber()];

        const tokenValue = fromDecimals(value, token);
        yourEarned = yourEarned.plus(tokenValue.multipliedBy(exchangeRate));
      });

      return {
        yourDeposit,
        yourEarned
      };
    });
  }
}
