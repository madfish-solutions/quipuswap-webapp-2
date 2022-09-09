import { Typed } from '@shared/decorators';

import { StableswapDividendsStatsDto } from './stableswap-dividends-stats.dto';

export class StableswapDividendsStatsResponseDto {
  @Typed({ type: StableswapDividendsStatsDto })
  item: StableswapDividendsStatsDto;
}
