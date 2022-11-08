import { Typed } from '@shared/decorators';

import { FarmingItemCommonResponseDto } from '../../dto';

export class FarmingListResponseDto {
  @Typed({ isArray: true, type: FarmingItemCommonResponseDto })
  list: Array<FarmingItemCommonResponseDto>;
}
