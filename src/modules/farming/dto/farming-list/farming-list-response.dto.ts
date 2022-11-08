import { Typed } from '@shared/decorators';

import { FarmingListItemResponseDto } from '../../dto';

export class FarmingListResponseDto {
  @Typed({ isArray: true, type: FarmingListItemResponseDto })
  list: Array<FarmingListItemResponseDto>;
}
