import { FarmingListStatsResponseDto } from '../../dto';
import { FarmingListStatsModel } from './farming-list-stats.model';

export class FarmingListStatsResponseModel extends FarmingListStatsResponseDto {
  stats: FarmingListStatsModel;

  constructor(dto: FarmingListStatsResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingListStatsResponseDto];
    }

    this.stats = new FarmingListStatsModel(dto.stats);
  }
}
