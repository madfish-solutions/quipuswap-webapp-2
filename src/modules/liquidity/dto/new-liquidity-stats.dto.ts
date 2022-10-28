import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class NewLiquidityStatsDto {
  @Typed()
  totalValueLocked: BigNumber;

  @Typed()
  maxApr: BigNumber;

  @Typed()
  poolsCount: BigNumber;
}
