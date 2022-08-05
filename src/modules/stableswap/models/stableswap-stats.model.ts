import { StableswapStatsDto } from '../dto';

export class StableswapStatsModel extends StableswapStatsDto {
  [key: string]: StableswapStatsDto[keyof StableswapStatsDto];
  constructor(dto: StableswapStatsDto) {
    super();

    for (const key in dto) {
      this[key] = dto[key as keyof StableswapStatsDto];
    }
  }
}
