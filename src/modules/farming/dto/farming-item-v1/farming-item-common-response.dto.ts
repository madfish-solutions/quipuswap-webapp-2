import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingListItemDto } from './farming-list-item.dto';

export class FarmingItemCommonResponseDto {
  @Typed()
  item: FarmingListItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
