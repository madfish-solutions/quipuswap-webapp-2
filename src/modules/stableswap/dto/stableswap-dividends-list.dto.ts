import { Typed } from '@shared/decorators';

import { StableswapDividendsItemDto } from './stableswap-dividends-item.dto';

export class StableswapDividendsListDto {
  @Typed({ isArray: true, type: StableswapDividendsItemDto })
  list: StableswapDividendsItemDto[];
}
