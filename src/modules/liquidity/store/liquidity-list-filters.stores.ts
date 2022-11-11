import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import {
  filterByBridget,
  filterByBTC,
  filterByDexTwo,
  filterByDust,
  filterByQuipu,
  filterByStableSwap,
  filterByTezotopia,
  filterByTokens,
  sortLiquidityItems
} from '../helpers';
import { LiquidityItemModel } from '../models';
import { LiquiditySortField } from '../pages/list/types';

const DUST_THRESHOLD = 100;
const DUST_THRESHOLD_BN = new BigNumber(DUST_THRESHOLD);

export class LiquidityListFiltersStore extends BaseFilterStore {
  tokens: Nullable<Array<Token>> = null;

  showDust = false;
  investedOnly = false;

  showStable = false;
  showBridged = false;
  showQuipu = false;
  showTezotopia = false;
  showBTC = false;
  showDexTwo = false;

  sortField: LiquiditySortField = LiquiditySortField.TVL;

  constructor() {
    super();

    makeObservable(this, {
      tokens: observable,

      showDust: observable,
      investedOnly: observable,

      showStable: observable,
      showBridged: observable,
      showQuipu: observable,
      showTezotopia: observable,
      showBTC: observable,
      showDexTwo: observable,

      sortField: observable,

      setTokens: action,
      setShowDust: action,
      setInvestedOnly: action,
      setShowStable: action,
      setShowBridged: action,
      setShowQuipu: action,
      setShowTezotopia: action,
      setShowBTC: action,
      setShowDexTwo: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<LiquidityItemModel>): Array<LiquidityItemModel> {
    return list
      .filter(filterByTokens(this.tokens))
      .filter(filterByDust(this.showDust, DUST_THRESHOLD_BN))
      .filter(filterByStableSwap(this.showStable))
      .filter(filterByBridget(this.showBridged))
      .filter(filterByQuipu(this.showQuipu))
      .filter(filterByTezotopia(this.showTezotopia))
      .filter(filterByBTC(this.showBTC))
      .filter(filterByDexTwo(this.showDexTwo))
      .sort(sortLiquidityItems(this.sortField, this.sortDirection));
  }

  setTokens(tokens: Nullable<Array<Token>>) {
    this.tokens = tokens;
  }

  setShowDust(state: boolean) {
    this.showDust = state;
  }
  setInvestedOnly(state: boolean) {
    this.investedOnly = state;
  }

  setShowStable(state: boolean) {
    this.showStable = state;
  }
  setShowBridged(state: boolean) {
    this.showBridged = state;
  }
  setShowQuipu(state: boolean) {
    this.showQuipu = state;
  }
  setShowTezotopia(state: boolean) {
    this.showTezotopia = state;
  }
  setShowBTC(state: boolean) {
    this.showBTC = state;
  }
  setShowDexTwo(state: boolean) {
    this.showDexTwo = state;
  }

  onSortFieldChange(field: LiquiditySortField) {
    this.sortField = field;
  }
}
