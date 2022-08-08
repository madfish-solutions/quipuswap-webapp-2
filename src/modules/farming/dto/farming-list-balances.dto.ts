import { Typed } from '@shared/decorators';

import { FarmingItemBalancesDto } from './farming-item-balances.dto';

export class FarmingListBalancesDto {
  @Typed({ isArray: true, type: FarmingItemBalancesDto })
  balances: Array<FarmingItemBalancesDto>;
}
