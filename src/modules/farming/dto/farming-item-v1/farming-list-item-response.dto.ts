import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingListItemDto } from './farming-list-item.dto';

export class FarmingListItemResponseDto {
  @Typed()
  item: FarmingListItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
