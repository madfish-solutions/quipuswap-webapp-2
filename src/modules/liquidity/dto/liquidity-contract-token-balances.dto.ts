import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class LiquidityContractTokenBalancesDto {
  @Typed()
  token_x_balance: BigNumber;

  @Typed()
  token_y_balance: BigNumber;
}
