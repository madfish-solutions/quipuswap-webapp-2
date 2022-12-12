import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { Nullable } from '@shared/types';

export class LiquidityV3PositionStore {
  positionId: Nullable<BigNumber> = null;

  constructor() {
    makeObservable(this, {
      positionId: observable,
      setPositionId: action
    });
  }

  setPositionId(id: BigNumber) {
    this.positionId = id;
  }
}
