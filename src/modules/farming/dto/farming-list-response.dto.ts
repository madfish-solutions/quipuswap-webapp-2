import { Typed } from '@shared/decorators';

import { FarmingItemResponseDto } from './farming-item-response.dto';

export class FarmingListResponseDto {
  @Typed({ isArray: true, type: FarmingItemResponseDto })
  list: Array<FarmingItemResponseDto>;
}
