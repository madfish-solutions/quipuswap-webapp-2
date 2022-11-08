import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingListStatsDto } from './farming-list-stats.dto';

export class FarmingListStatsResponseDto {
  @Typed()
  stats: FarmingListStatsDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
