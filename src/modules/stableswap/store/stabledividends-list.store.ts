import { BigNumber } from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { fromDecimals, isEmptyArray } from '@shared/helpers';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getStableDividendsListApi, getStableDividendsStatsApi, getStakerInfo } from '../api';
import { stableDividendsListMapper, stakerInfoMapper, statsMapper } from '../mapping';
import { listWithUserInfo } from '../stabledividends/pages/list/helpers';
import {
  RawStableDividendsItem,
  RawStableDividendsStats,
  RawStakerInfo,
  StableDividendsItem,
  StableDividendsStats,
  StakerInfo
} from '../types';

export class StableDividendsListStore {
  readonly statsStore = new LoadingErrorData<RawStableDividendsStats, Nullable<StableDividendsStats>>(
    null,
    async () => await getStableDividendsStatsApi(),
    statsMapper
  );

  readonly listStore = new LoadingErrorData<Array<RawStableDividendsItem>, Array<StableDividendsItem>>(
    [],
    async () => await getStableDividendsListApi(),
    stableDividendsListMapper
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

  get info(): Array<StakerInfo> {
    if (isEmptyArray(this.stakerInfo.data) || isEmptyArray(this.list)) {
      return [];
    }

    return this.stakerInfo.data.map(({ yourReward, yourDeposit }: RawStakerInfo, infoIndex) => {
      let yourEarnedInUsd = new BigNumber('0');
      const { tokensInfo } = this.list[infoIndex];

      yourReward?.forEach((value, tokenIndex) => {
        const { token, exchangeRate } = tokensInfo[tokenIndex.toNumber()];

        const tokenValue = fromDecimals(value, token);
        yourEarnedInUsd = yourEarnedInUsd.plus(tokenValue.multipliedBy(exchangeRate));
      });

      return {
        yourDeposit,
        yourEarnedInUsd
      };
    });
  }

  get listWithUserInfo() {
    return listWithUserInfo(this.list, this.info);
  }

  get filteredList() {
    return this.rootStore.stableDividendsFilterStore?.filterAndSort(this.listWithUserInfo);
  }
}
