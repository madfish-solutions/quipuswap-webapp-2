import { Typed } from '@shared/decorators';

import { StableswapItemDto } from './stableswap-item.dto';

export class StableswapListDto {
  @Typed({ type: StableswapItemDto, isArray: true })
  list!: Array<StableswapItemDto>;
}
