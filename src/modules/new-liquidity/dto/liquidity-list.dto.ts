import { Typed } from '@shared/decorators';

import { LiquidityItemResponseDto } from './liquidity-item.dto';

export class LiquidityListDto {
  @Typed({ type: LiquidityItemResponseDto, isArray: true })
  list: Array<LiquidityItemResponseDto>;
}
