import { StableswapDividendsStatsDto } from '../dto';

export class StableswapDividendsStatsModel extends StableswapDividendsStatsDto {
  constructor(dto: StableswapDividendsStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StableswapDividendsStatsDto];
    }
  }
}
