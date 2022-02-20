import { Nullable } from '@quipuswap/ui-kit';
import { TezosToolkit } from '@taquito/taquito';
import { action, makeObservable, observable } from 'mobx';

import { AuthStore } from './auth.store';
import { StakingStore } from './staking.store';
import { UiStore } from './ui.store';

export class RootStore {
  authStore: AuthStore;
  uiStore: UiStore;
  stakingStore: StakingStore;

  tezos: Nullable<TezosToolkit> = null;

  constructor() {
    this.authStore = new AuthStore(this);
    this.uiStore = new UiStore(this);
    this.stakingStore = new StakingStore(this);

    makeObservable(this, {
      tezos: observable,
      setTezos: action
    });
  }

  setTezos(tezos: Nullable<TezosToolkit>) {
    this.tezos = tezos;
  }
}
