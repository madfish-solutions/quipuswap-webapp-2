import { Categories } from '../interfaces';
import { LiquidityItemModel } from '../models';

export const filterByStableSwap =
  (showStable: boolean) =>
  ({ item }: LiquidityItemModel) =>
    showStable ? item.poolLabels.includes(Categories.Stable) : true;
