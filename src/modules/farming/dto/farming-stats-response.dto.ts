import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { FarmingStatsDto } from './farming-stats.dto';

export class FarmingStatsResponseDto {
  @Typed()
  stats: FarmingStatsDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
