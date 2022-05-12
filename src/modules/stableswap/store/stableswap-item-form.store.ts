import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';
import { Undefined } from '@shared/types';

export class StableswapItemFormStore {
  inputAmounts: Array<string> = [];

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      inputAmounts: observable,

      initInputAmounts: action,
      setInputAmount: action
    });
  }

  initInputAmounts(length: number) {
    this.inputAmounts = Array(length).fill('');
  }

  setInputAmount(amount: string, index: number) {
    this.inputAmounts[index] = amount;
  }

  getInputAmount(index: number): Undefined<string> {
    return this.inputAmounts[index];
  }
}
