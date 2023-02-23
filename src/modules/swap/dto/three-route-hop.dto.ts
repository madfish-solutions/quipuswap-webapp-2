import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class ThreeRouteHopDto {
  @Typed()
  dex: BigNumber;

  @Typed()
  forward: boolean;
}
