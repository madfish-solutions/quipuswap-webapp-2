import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { LiquidityStatsDto } from './liquidity-stats.dto';

export class LiquidityResponseDto {
  @Typed()
  stats: LiquidityStatsDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
