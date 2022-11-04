import { HOT_POOLS } from '@config/config';

import { LiquidityItemModel } from '../models';

export const isHotPool = (model: LiquidityItemModel) => {
  return HOT_POOLS.some(({ id, type }) => id === model.id.toString() && type === model.type);
};

export const sortHotPool = (a: LiquidityItemModel, b: LiquidityItemModel) => {
  const aIndex = HOT_POOLS.findIndex(({ id, type }) => id === a.id.toString() && type === a.type);
  const bIndex = HOT_POOLS.findIndex(({ id, type }) => id === b.id.toString() && type === b.type);

  return aIndex - bIndex;
};
