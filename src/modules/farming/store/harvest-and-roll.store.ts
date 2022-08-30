import { action, makeObservable, observable } from 'mobx';
import { noop } from 'rxjs';

import { BaseFilterStore, RootStore } from '@shared/store';

export class HarvestAndRollStore extends BaseFilterStore {
  opened = false;
  private _resolveOnClose: (value: void) => void = noop;

  constructor(private rootStore: RootStore) {
    super();

    makeObservable(this, {
      opened: observable,

      open: action,
      close: action
    });
  }

  async open() {
    this.opened = true;

    return new Promise(resolve => {
      this._resolveOnClose = resolve;
    });
  }

  close() {
    this.opened = false;
    this._resolveOnClose();
  }
}
