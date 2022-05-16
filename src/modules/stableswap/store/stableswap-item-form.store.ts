import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';

export class StableswapItemFormStore {
  inputAmounts: Array<Nullable<BigNumber>> = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      inputAmounts: observable,

      initInputAmounts: action,
      setInputAmount: action
    });
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill(null);
  }

  setInputAmount(amount: Nullable<BigNumber>, index: number) {
    this.inputAmounts[index] = amount;
  }
}
