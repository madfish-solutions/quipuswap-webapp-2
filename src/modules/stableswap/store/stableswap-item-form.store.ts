import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';

export class StableswapItemFormStore {
  shares: Nullable<BigNumber> = null;
  inputAmounts: Array<Nullable<BigNumber>> = [];
  isBalancedProportion = true;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      shares: observable,
      inputAmounts: observable,
      isBalancedProportion: observable,

      initInputAmounts: action,
      setInputAmount: action,
      setShares: action,
      setLpAndTokenInputAmount: action,
      setLpAndTokenInputAmounts: action,
      clearStore: action,
      setInputAmounts: action,
      setIsBalancedProportion: action
    });
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill(null);
  }

  setShares(shares: Nullable<BigNumber>) {
    this.shares = shares;
  }

  setInputAmount(amount: Nullable<BigNumber>, index: number) {
    this.inputAmounts[index] = amount;
  }

  setInputAmounts(tokenValues: Array<Nullable<BigNumber>>) {
    this.inputAmounts = tokenValues;
  }

  setLpAndTokenInputAmount(shares: Nullable<BigNumber>, tokenValue: Nullable<BigNumber>, indexOfTokenValue: number) {
    this.setShares(shares);
    this.setInputAmount(tokenValue, indexOfTokenValue);
  }

  setLpAndTokenInputAmounts(lpValue: Nullable<BigNumber>, tokenValues: Array<Nullable<BigNumber>>) {
    this.setShares(lpValue);
    this.setInputAmounts(tokenValues);
  }

  clearStore() {
    this.shares = null;
    this.inputAmounts = this.inputAmounts.map(() => null);
  }

  setIsBalancedProportion(state: boolean) {
    this.isBalancedProportion = state;
  }
}
