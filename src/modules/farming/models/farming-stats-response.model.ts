import { FarmingStatsResponseDto } from '../dto';
import { FarmingStatsModel } from './farming-stats.model';

export class FarmingStatsResponseModel extends FarmingStatsResponseDto {
  stats: FarmingStatsModel;

  constructor(dto: FarmingStatsResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingStatsResponseDto];
    }

    this.stats = new FarmingStatsModel(dto.stats);
  }
}
