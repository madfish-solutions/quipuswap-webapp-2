import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class FarmingListItemBalancesDto {
  @Typed()
  id: string;

  @Typed({ optional: true })
  contractAddress?: string;

  @Typed({ optional: true })
  myBalance?: BigNumber;

  @Typed({ optional: true })
  depositBalance?: BigNumber;

  @Typed({ optional: true })
  earnBalance?: BigNumber;
}
