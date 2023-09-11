import { BlockInfoDto } from '@shared/dto';
import { BlockInfoModel } from '@shared/models';

import { LiquidityStatsModel } from './liquidity-stats.model';
import { LiquidityResponseDto, LiquidityStatsDto } from '../dto';

export class LiquidityResponseModel extends LiquidityResponseDto {
  stats: LiquidityStatsDto;
  blockInfo: BlockInfoDto;

  constructor(dto: LiquidityResponseDto) {
    super();

    this.stats = new LiquidityStatsModel(dto.stats);
    this.blockInfo = new BlockInfoModel(dto.blockInfo);
  }
}
