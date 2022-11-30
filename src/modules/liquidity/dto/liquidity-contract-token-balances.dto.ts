import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class LiquidityContractTokenBalancesDto {
  @Typed()
  tokenXBalance: BigNumber;

  @Typed()
  tokenYBalance: BigNumber;
}
