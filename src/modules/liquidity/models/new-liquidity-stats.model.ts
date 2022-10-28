import { LiquidityStatsDto } from '../dto';

export class NewLiquidityStatsModel extends LiquidityStatsDto {
  constructor(dto: LiquidityStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof LiquidityStatsDto];
    }
  }
}
