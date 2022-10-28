import { BlockInfoDto } from '@shared/dto';
import { BlockInfoModel } from '@shared/models';

import { LiquidityResponseDto, LiquidityStatsDto } from '../dto';
import { NewLiquidityStatsModel } from './new-liquidity-stats.model';

export class NewLiquidityResponseModel extends LiquidityResponseDto {
  stats: LiquidityStatsDto;
  blockInfo: BlockInfoDto;

  constructor(dto: LiquidityResponseDto) {
    super();

    this.stats = new NewLiquidityStatsModel(dto.stats);
    this.blockInfo = new BlockInfoModel(dto.blockInfo);
  }
}
