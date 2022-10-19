import { YouvesStakeDto } from '../../dto';

export class YouvesStakeModel extends YouvesStakeDto {
  constructor(dto: YouvesStakeDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesFarmingItemDto];
    }
  }
}
