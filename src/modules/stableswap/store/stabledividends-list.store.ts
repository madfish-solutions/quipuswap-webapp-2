import { BigNumber } from 'bignumber.js';
import { computed, makeObservable } from 'mobx';

import { toReal, isEmptyArray, defined } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { LoadingErrorData, RootStore } from '@shared/store';

import { getStableDividendsListApi, getStableDividendsStatsApi, getStakerInfo } from '../api';
import {
  StableswapDividendsListModel,
  StableswapDividendsStatsResponseModel,
  StakerInfoListResponseModel
} from '../models';
import { listWithUserInfo } from '../stabledividends/pages/list/helpers';
import { RawStakerInfo, StakerInfo } from '../types';

@ModelBuilder()
export class StableDividendsListStore {
  //#region stats store
  @Led({
    default: { item: null },
    loader: async () => ({ item: await getStableDividendsStatsApi() }),
    model: StableswapDividendsStatsResponseModel
  })
  readonly statsStore: LoadingErrorData<StableswapDividendsStatsResponseModel, { item: null }>;

  get stats() {
    return this.statsStore.model.item;
  }
  //#endregion stats store

  //#region list store
  @Led({
    default: { list: [] },
    loader: async () => ({ list: await getStableDividendsListApi() }),
    model: StableswapDividendsListModel
  })
  readonly listStore: LoadingErrorData<StableswapDividendsListModel, { list: [] }>;

  get list() {
    return this.listStore.model.list;
  }

  get info(): Array<StakerInfo> {
    const stakerInfoList = this.stakerInfo.model.list;

    if (isEmptyArray(stakerInfoList) || isEmptyArray(this.list)) {
      return [];
    }

    return defined(stakerInfoList).map(({ yourReward, yourDeposit }: RawStakerInfo, infoIndex) => {
      let yourEarnedInUsd = new BigNumber('0');
      const { tokensInfo } = this.list[infoIndex];

      yourReward?.forEach((value, tokenIndex) => {
        const { token, exchangeRate } = tokensInfo[tokenIndex.toNumber()];

        const realTokenReward = toReal(value, token);
        yourEarnedInUsd = yourEarnedInUsd.plus(realTokenReward.multipliedBy(exchangeRate));
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
  //#endregion list store

  @Led({
    default: { list: null },
    loader: async self => self.getStakerInfo(),
    model: StakerInfoListResponseModel
  })
  readonly stakerInfo: LoadingErrorData<StakerInfoListResponseModel, { list: null }>;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      stats: computed,
      list: computed,
      info: computed
    });
  }

  async getStakerInfo() {
    return {
      list: await getStakerInfo(this.rootStore.tezos, this.list, this.rootStore.authStore.accountPkh)
    };
  }
}
