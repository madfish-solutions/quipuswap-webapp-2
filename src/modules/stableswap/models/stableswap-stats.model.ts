import { StableswapStatsDto } from '../dto';

export class StableswapStatsModel extends StableswapStatsDto {
  constructor(dto: StableswapStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
