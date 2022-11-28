import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class LiquidityContractTokenBalancesDto {
  @Typed({ type: BigNumber })
  token_x_balance: BigNumber;

  @Typed({ type: BigNumber })
  token_y_balance: BigNumber;
}
