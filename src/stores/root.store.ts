import { Nullable } from '@quipuswap/ui-kit';
import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { AuthStore } from './auth.store';
import { FarmingFilterStore } from './farming-filter.store';
import { FarmingItemStore } from './farming-item.store';
import { FarmingListStore } from './farming-list.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;

  farmingListStore: FarmingListStore;
  farmingFilterStore: FarmingFilterStore;
  farmingItemStore: FarmingItemStore;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.farmingListStore = new FarmingListStore(this);
    this.farmingFilterStore = new FarmingFilterStore(this);
    this.farmingItemStore = new FarmingItemStore(this);

    makeObservable(this, {
      tezos: observable,
      setTezos: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }
}
