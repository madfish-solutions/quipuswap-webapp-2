import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class FeeGrowthDto {
  @Typed()
  x: BigNumber;

  @Typed()
  y: BigNumber;
}
