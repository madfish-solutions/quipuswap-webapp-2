import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';
import { noop } from 'rxjs';

import { BaseFilterStore, RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

import { CoinSide } from '../../coinflip';

export class HarvestAndRollStore extends BaseFilterStore {
  opened = false;
  private _resolveOnClose: (value: void) => void = noop;

  coinSide: Nullable<CoinSide> = null;
  coinSideError: Nullable<string> = null;
  isLoading = false;
  isLoadingHarvest = false;

  rewardsInQuipu: Nullable<BigNumber> = null;
  rewardsQuipuInUsd: Nullable<BigNumber> = null;

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
      opened: observable,
      coinSide: observable,
      coinSideError: observable,
      isLoading: observable,
      isLoadingHarvest: observable,
      rewardsInQuipu: observable,
      rewardsQuipuInUsd: observable,

      open: action,
      close: action,
      setCoinSide: action,
      setCoinSideError: action,
      startLoading: action,
      finishLoading: action,
      startHarvestLoading: action,
      finishHarvestLoading: action,
      setRewardsInQuipu: action,
      setRewardsQuipuInUsd: action
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

  setCoinSide(coinSide: Nullable<CoinSide>) {
    this.coinSide = coinSide;
  }

  setCoinSideError(coinSideError: Nullable<string>) {
    this.coinSideError = coinSideError;
  }

  startLoading() {
    this.isLoading = true;
  }

  finishLoading() {
    this.isLoading = false;
  }

  startHarvestLoading() {
    this.isLoadingHarvest = true;
  }

  finishHarvestLoading() {
    this.isLoadingHarvest = false;
  }

  setRewardsInQuipu(rewardsInQuipu: Nullable<BigNumber>) {
    this.rewardsInQuipu = rewardsInQuipu;
  }

  setRewardsQuipuInUsd(rewardsQuipuInUsd: Nullable<BigNumber>) {
    this.rewardsQuipuInUsd = rewardsQuipuInUsd;
  }
}
