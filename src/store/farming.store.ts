import { makeObservable } from 'mobx';

import { RootStore } from './root.store';

export class FarmingStore {
  constructor(private readonly rootStore: RootStore) {
    makeObservable(this);
  }
}
