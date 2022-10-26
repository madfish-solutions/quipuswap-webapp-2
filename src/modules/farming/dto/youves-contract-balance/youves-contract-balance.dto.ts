import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class YouvesContractBalanceDto {
  @Typed({ type: BigNumber })
  balance: BigNumber;
}
