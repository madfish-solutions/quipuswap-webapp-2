import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';

export class StableswapItemFormStore {
  lpInputAmount: Nullable<BigNumber> = null;
  inputAmounts: Array<Nullable<BigNumber>> = [];
  isBalancedProportion = false;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      lpInputAmount: observable,
      inputAmounts: observable,
      isBalancedProportion: observable,

      initInputAmounts: action,
      setInputAmount: action,
      setLpInputAmount: action,
      setLpAndTokenInputAmounts: action,
      clearStore: action,
      setIsBalancedProportion: action
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

  setInputAmounts(tokenValues: Array<Nullable<BigNumber>>) {
    this.inputAmounts = tokenValues;
  }

  setLpAndTokenInputAmounts(lpValue: Nullable<BigNumber>, tokenValues: Array<Nullable<BigNumber>>) {
    this.setLpInputAmount(lpValue);
    this.setInputAmounts(tokenValues);
  }

  clearStore() {
    this.lpInputAmount = null;
    this.inputAmounts = this.inputAmounts.map(() => null);
  }

  setIsBalancedProportion(state: boolean) {
    this.isBalancedProportion = state;
  }
}
