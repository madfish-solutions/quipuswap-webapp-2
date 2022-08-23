import { StableswapDividendsStatsResponseDto } from '../dto';
import { StableswapDividendsStatsModel } from './stableswap-dividends-stats.model';

export class StableswapDividendsStatsResponseModel extends StableswapDividendsStatsResponseDto {
  item: StableswapDividendsStatsModel;

  constructor(dto: StableswapDividendsStatsResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StableswapDividendsStatsResponseDto];
    }
    this.item = new StableswapDividendsStatsModel(dto.item);
  }
}
