import { Typed } from '@shared/decorators';

import { StableswapDividendsItemDto } from './stableswap-dividends-item.dto';

export class StableswapDividendsItemResponseDto {
  @Typed({ type: StableswapDividendsItemDto })
  item: StableswapDividendsItemDto;
}
