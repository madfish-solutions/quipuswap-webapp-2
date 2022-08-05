import { NewLiquidityStatsDto } from '../dto';

export class NewLiquidityStatsModel extends NewLiquidityStatsDto {
  [key: string]: NewLiquidityStatsDto[keyof NewLiquidityStatsDto];

  constructor(dto: NewLiquidityStatsDto) {
    super();

    for (const key in dto) {
      this[key] = dto[key as keyof NewLiquidityStatsDto];
    }
  }
}
