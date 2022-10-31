import { BlockInfoDto } from '@shared/dto';
import { BlockInfoModel } from '@shared/models';

import { LiquidityResponseDto, LiquidityStatsDto } from '../dto';
import { LiquidityStatsModel } from './liquidity-stats.model';

export class LiquidityResponseModel extends LiquidityResponseDto {
  stats: LiquidityStatsDto;
  blockInfo: BlockInfoDto;

  constructor(dto: LiquidityResponseDto) {
    super();

    this.stats = new LiquidityStatsModel(dto.stats);
    this.blockInfo = new BlockInfoModel(dto.blockInfo);
  }
}
