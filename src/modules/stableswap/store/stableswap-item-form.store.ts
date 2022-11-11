import BigNumber from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

export class StableswapItemFormStore {
  shares: Nullable<BigNumber> = null;
  isBalancedProportion = true;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      shares: observable,
      isBalancedProportion: observable,

      setShares: action,
      setLpAndTokenInputAmounts: action,
      clearStore: action,
      setIsBalancedProportion: action
    });
  }

  setShares(shares: Nullable<BigNumber>) {
    this.shares = shares;
  }

  setLpAndTokenInputAmounts(lpValue: Nullable<BigNumber>) {
    this.setShares(lpValue);
  }

  clearStore() {
    this.shares = null;
  }

  setIsBalancedProportion(state: boolean) {
    this.isBalancedProportion = state;
  }
}
