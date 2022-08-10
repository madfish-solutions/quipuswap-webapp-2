import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingItemDto } from './farming-item.dto';

export class FarmingItemResponseDto {
  @Typed()
  item: FarmingItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
