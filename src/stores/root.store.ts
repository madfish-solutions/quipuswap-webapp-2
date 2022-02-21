import { Nullable } from '@quipuswap/ui-kit';
import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { AuthStore } from './auth.store';
import { NotificationsStore } from './notifications.store';
import { StakingItemStore } from './staking-item.store';
import { StakingListStore } from './staking-list.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  notificationsStore: NotificationsStore;

  stakingListStore: StakingListStore;
  stakingItemStore: StakingItemStore;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.notificationsStore = new NotificationsStore(this);
    this.stakingListStore = new StakingListStore(this);
    this.stakingItemStore = new StakingItemStore(this);

    makeObservable(this, {
      tezos: observable,
      setTezos: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }
}
