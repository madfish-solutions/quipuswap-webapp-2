import { FarmingListStatsDto } from '../../dto';

export class FarmingListStatsModel extends FarmingListStatsDto {
  constructor(dto: FarmingListStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingListStatsDto];
    }
  }
}
