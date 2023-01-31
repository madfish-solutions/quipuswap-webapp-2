import { LiquidityV3PositionModel } from '@modules/liquidity/models';

export const sortPositionsByNewer = (a: LiquidityV3PositionModel, b: LiquidityV3PositionModel) =>
  b.id.toNumber() - a.id.toNumber();
