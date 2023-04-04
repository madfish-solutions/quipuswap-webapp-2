import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { ThreeRouteSwapChainDto } from './three-route-swap-chain.dto';

export class ThreeRouteSwapResponseDto {
  @Typed()
  input: BigNumber;

  @Typed()
  output: BigNumber;

  @Typed({ type: ThreeRouteSwapChainDto, isArray: true })
  chains: ThreeRouteSwapChainDto[];
}
