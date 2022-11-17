import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingItemV1Dto } from './farming-item-v1.dto';

export class FarmingItemResponseDto {
  @Typed()
  item: FarmingItemV1Dto;

  @Typed()
  blockInfo: BlockInfoDto;
}
