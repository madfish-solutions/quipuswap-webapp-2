import { Typed } from '@shared/decorators';

import { FarmingListItemResponseDto } from '../farming-list-item';

export class FarmingListResponseDto {
  @Typed({ isArray: true, type: FarmingListItemResponseDto })
  list: Array<FarmingListItemResponseDto>;
}
