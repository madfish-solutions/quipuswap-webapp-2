import { action, makeObservable, observable } from 'mobx';

import { Nullable } from '@shared/types';

export class LiquidityV3PositionStore {
  positionId: Nullable<number> = null;

  constructor() {
    makeObservable(this, {
      positionId: observable,
      setPositionId: action
    });
  }

  setPositionId(id: number) {
    this.positionId = id;
  }
}
