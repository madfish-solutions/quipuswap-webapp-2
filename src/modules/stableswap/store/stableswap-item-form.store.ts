import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';

export class StableswapItemFormStore {
  lpInputAmount: Nullable<BigNumber> = null;
  inputAmounts: Array<Nullable<BigNumber>> = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      lpInputAmount: observable,
      inputAmounts: observable,

      initInputAmounts: action,
      setInputAmount: action,
      clearStore: action
    });
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill(null);
  }

  setLpInputAmount(amount: Nullable<BigNumber>) {
    this.lpInputAmount = amount;
  }

  setInputAmount(amount: Nullable<BigNumber>, index: number) {
    this.inputAmounts[index] = amount;
  }

  clearStore() {
    this.lpInputAmount = null;
    this.inputAmounts = this.inputAmounts.map(_ => null);
  }
}
