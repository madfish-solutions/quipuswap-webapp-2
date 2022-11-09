import { Typed } from '@shared/decorators';

import { FarmingListItemBalancesDto } from '../farming-item-v1';

export class FarmingListBalancesDto {
  @Typed({ isArray: true, type: FarmingListItemBalancesDto })
  balances: Array<FarmingListItemBalancesDto>;
}
