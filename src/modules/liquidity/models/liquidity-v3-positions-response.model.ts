import { LiquidityV3PositionsResponseDto } from '../dto';
import { LiquidityV3PositionModel } from './liquidity-v3-position.model';

export class LiquidityV3PositionsResponseModel extends LiquidityV3PositionsResponseDto {
  value: LiquidityV3PositionModel[];

  constructor(dto: LiquidityV3PositionsResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof LiquidityV3PositionsResponseDto];
    }

    this.value = dto.value.map(positionDto => new LiquidityV3PositionModel(positionDto));
  }
}
