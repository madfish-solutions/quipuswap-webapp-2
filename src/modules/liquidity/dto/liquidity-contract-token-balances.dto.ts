import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class LiquidityContractTokenBalancesDto {
  @Typed()
  tokenXbalance: BigNumber;

  @Typed()
  tokenYbalance: BigNumber;
}
