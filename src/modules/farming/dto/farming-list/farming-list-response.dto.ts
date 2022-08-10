import { Typed } from '@shared/decorators';

import { FarmingItemResponseDto } from '../farming-item';

export class FarmingListResponseDto {
  @Typed({ isArray: true, type: FarmingItemResponseDto })
  list: Array<FarmingItemResponseDto>;
}
