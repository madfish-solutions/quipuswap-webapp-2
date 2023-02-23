import { BigNumber } from 'bignumber.js';
import { action, makeObservable, observable } from 'mobx';

import { BaseFilterStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { filterByDust, filterByPoolType, filterByTokens, sortLiquidityItems } from '../helpers';
import { PoolTypeOptionEnum } from '../interfaces';
import { LiquidityItemModel } from '../models';
import { LiquiditySortField } from '../pages/list/types';

const DUST_THRESHOLD = 100;
const DUST_THRESHOLD_BN = new BigNumber(DUST_THRESHOLD);

export class LiquidityListFiltersStore extends BaseFilterStore {
  tokens: Nullable<Array<Token>> = null;

  showDust = true;
  investedOnly = false;

  poolTypeOption = PoolTypeOptionEnum.ALL;

  sortField: LiquiditySortField = LiquiditySortField.TVL;

  constructor() {
    super();

    makeObservable(this, {
      tokens: observable,

      showDust: observable,
      investedOnly: observable,

      poolTypeOption: observable,

      sortField: observable,

      setTokens: action,
      setShowDust: action,
      setInvestedOnly: action,
      setPoolTypeOption: action,
      onSortFieldChange: action
    });
  }

  filterAndSort(list: Array<LiquidityItemModel>): Array<LiquidityItemModel> {
    return list
      .filter(filterByTokens(this.tokens))
      .filter(filterByDust(this.showDust, DUST_THRESHOLD_BN))
      .filter(filterByPoolType(this.poolTypeOption))
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

  onSortFieldChange(field: LiquiditySortField) {
    this.sortField = field;
  }

  setPoolTypeOption(poolTypeOption: PoolTypeOptionEnum) {
    // eslint-disable-next-line no-console
    console.log('setPoolTypeOption', poolTypeOption);
    this.poolTypeOption = poolTypeOption;
  }
}
