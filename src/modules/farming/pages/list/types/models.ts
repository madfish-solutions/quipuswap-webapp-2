import { BigNumber } from 'bignumber.js';

import { Nullable } from '@shared/types';

import { FarmingItemV1Model, FarmingListItemModel, FarmingItemV2YouvesModel } from '../../../models';

interface Balances {
  myBalance?: Nullable<BigNumber>;
  depositBalance?: Nullable<BigNumber>;
  earnBalance?: Nullable<BigNumber>;
  fullRewardBalance?: Nullable<BigNumber>;
}

export type FarmingItemModel = FarmingItemV1Model | FarmingItemV2YouvesModel;

export type FarmingItemV1WithBalances = FarmingItemV1Model & Balances;
export type FarmingItemV2YouvesWithBalances = FarmingItemV2YouvesModel & Balances;
export type FarmingItemWithBalances = FarmingItemModel & Balances;
export type FarmingListItemWithBalances = FarmingListItemModel & Balances; // & FarmingListItemBalancesModel
