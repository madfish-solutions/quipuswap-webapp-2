import { FarmingStatsDto } from '../../dto';

export class FarmingStatsModel extends FarmingStatsDto {
  constructor(dto: FarmingStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingStatsDto];
    }
  }
}
