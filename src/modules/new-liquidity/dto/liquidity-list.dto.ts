import { Typed } from '@shared/decorators';

import { LiquidityItemWrapDto } from './liquidity-item.dto';

export class LiquidityListDto {
  @Typed({ type: LiquidityItemWrapDto, isArray: true })
  list: Array<LiquidityItemWrapDto>;
}
