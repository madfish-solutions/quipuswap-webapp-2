import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { YouvesFarmingItemDto } from './youves-farming-item.dto';

export class YouvesFarmingItemResponseDto {
  @Typed()
  item: YouvesFarmingItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
