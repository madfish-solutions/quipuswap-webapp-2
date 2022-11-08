import { BigNumber } from 'bignumber.js';

import {
  FarmingItemV1Model,
  FarmingListItemBalancesModel,
  FarmingListItemModel,
  FarmingItemV2YouvesModel
} from '../../../models';

interface Balances {
  depositBalance: Nullable<BigNumber>;
  earnBalance: Nullable<BigNumber>;
}

export type FarmingItemModel = FarmingItemV1Model | FarmingItemV2YouvesModel;

export type FarmingItemV1WithBalances = FarmingItemV1Model & Balances;
export type FarmingItemV2YouvesWithBalances = FarmingItemV2YouvesModel & Balances;
export type FarmingItemWithBalances = FarmingItemModel & Balances;
export type FarmingListItemWithBalances = FarmingListItemModel & FarmingListItemBalancesModel;
