import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class FarmingItemBalancesDto {
  @Typed()
  id: string;

  @Typed()
  contractAddress: string;

  @Typed({ optional: true })
  myBalance?: BigNumber;

  @Typed({ optional: true })
  depositBalance?: BigNumber;

  @Typed({ optional: true })
  earnBalance?: BigNumber;
}
