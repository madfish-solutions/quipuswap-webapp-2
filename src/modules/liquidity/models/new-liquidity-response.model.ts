import { BlockInfoDto } from '@shared/dto';
import { BlockInfoModel } from '@shared/models';

import { NewLiquidityResponseDto, NewLiquidityStatsDto } from '../dto';
import { NewLiquidityStatsModel } from './new-liquidity-stats.model';

export class NewLiquidityResponseModel extends NewLiquidityResponseDto {
  stats: NewLiquidityStatsDto;
  blockInfo: BlockInfoDto;

  constructor(dto: NewLiquidityResponseDto) {
    super();

    this.stats = new NewLiquidityStatsModel(dto.stats);
    this.blockInfo = new BlockInfoModel(dto.blockInfo);
  }
}
