import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingItemV2YouvesDto } from './farming-item-v2-youves.dto';

export class FarmingItemV2YouvesResponseDto {
  @Typed()
  item: FarmingItemV2YouvesDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
