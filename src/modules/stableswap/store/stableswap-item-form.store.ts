import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';

export class StableswapItemFormStore {
  shares: Nullable<BigNumber> = null;
  inputAmounts: Array<BigNumber> = [];
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
      setIsBalancedProportion: action
    });
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill(new BigNumber('0'));
  }

  setShares(shares: BigNumber) {
    this.shares = shares;
  }

  setInputAmount(amount: BigNumber, index: number) {
    this.inputAmounts[index] = amount;
  }

  setInputAmounts(tokenValues: Array<BigNumber>) {
    this.inputAmounts = tokenValues;
  }

  setLpAndTokenInputAmount(shares: BigNumber, tokenValue: BigNumber, indexOfTokenValue: number) {
    this.setShares(shares);
    this.setInputAmount(tokenValue, indexOfTokenValue);
  }

  setLpAndTokenInputAmounts(lpValue: BigNumber, tokenValues: Array<BigNumber>) {
    this.setShares(lpValue);
    this.setInputAmounts(tokenValues);
  }

  clearStore() {
    this.shares = null;
    this.inputAmounts = [];
  }

  setIsBalancedProportion(state: boolean) {
    this.isBalancedProportion = state;
  }
}
