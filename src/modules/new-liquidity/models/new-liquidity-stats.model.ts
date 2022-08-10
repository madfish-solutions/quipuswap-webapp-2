import { NewLiquidityStatsDto } from '../dto';

export class NewLiquidityStatsModel extends NewLiquidityStatsDto {
  constructor(dto: NewLiquidityStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof NewLiquidityStatsDto];
    }
  }
}
