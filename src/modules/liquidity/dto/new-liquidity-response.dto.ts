import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { NewLiquidityStatsDto } from './new-liquidity-stats.dto';

export class NewLiquidityResponseDto {
  @Typed()
  stats: NewLiquidityStatsDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
