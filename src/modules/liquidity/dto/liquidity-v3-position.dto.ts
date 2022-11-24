import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class LiquidityV3PositionDto {
  @Typed()
  id: BigNumber;

  @Typed()
  minRange: BigNumber;

  @Typed()
  maxRange: BigNumber;

  @Typed()
  liqAmount: BigNumber;

  @Typed()
  tokenXFees: BigNumber;

  @Typed()
  tokenYFees: BigNumber;
}
