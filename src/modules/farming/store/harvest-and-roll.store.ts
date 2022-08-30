import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore, RootStore } from '@shared/store';

export class HarvestAndRollStore extends BaseFilterStore {
  opened = false;

  constructor(private rootStore: RootStore) {
    super();

    makeObservable(this, {
      opened: observable,

      open: action,
      close: action
    });
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }
}
