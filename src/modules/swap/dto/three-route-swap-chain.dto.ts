import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { ThreeRouteHopDto } from './three-route-hop.dto';

export class ThreeRouteSwapChainDto {
  @Typed()
  input: BigNumber;

  @Typed()
  output: BigNumber;

  @Typed({ type: ThreeRouteHopDto, isArray: true })
  hops: ThreeRouteHopDto[];
}
