import { Typed } from '@shared/decorators';

import { LiquidityV3PositionDto } from './liquidity-v3-position.dto';

export class LiquidityV3PositionsResponseDto {
  @Typed({ isArray: true, type: LiquidityV3PositionDto })
  value: LiquidityV3PositionDto[];
}
