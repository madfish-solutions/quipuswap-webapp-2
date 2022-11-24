import { LiquidityV3PositionDto } from '../dto';

export class LiquidityV3PositionModel extends LiquidityV3PositionDto {
  constructor(dto: LiquidityV3PositionDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof LiquidityV3PositionDto];
    }
  }
}
