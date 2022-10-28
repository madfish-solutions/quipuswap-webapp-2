import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingItemCommonDto } from './farming-item-common.dto';

export class FarmingItemCommonResponseDto {
  @Typed()
  item: FarmingItemCommonDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
