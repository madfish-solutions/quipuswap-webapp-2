import { computed, makeObservable } from 'mobx';

import { LedProposal, ModelBuilderProposal } from '@shared/model-builder';
import { LoadingErrorDataProposal, RootStore } from '@shared/store';

import { getStableswapItemApi } from '../api';
import { StableswapItemModel } from '../models';
import { RawStableswapItem } from '../types';

@ModelBuilderProposal()
export class StableswapItemStore {
  //#region item store
  @LedProposal({
    default: null,
    loader: getStableswapItemApi,
    model: StableswapItemModel
  })
  readonly itemStore: LoadingErrorDataProposal<
    StableswapItemModel,
    null,
    Parameters<typeof getStableswapItemApi>,
    RawStableswapItem
  >;

  get item() {
    return this.itemStore.model;
  }
  //#endregion item store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      item: computed
    });
  }
}
