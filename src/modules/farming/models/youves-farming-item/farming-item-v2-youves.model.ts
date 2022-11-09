import { FarmingItemV2YouvesDto } from '../../dto';

export class FarmingItemV2YouvesModel extends FarmingItemV2YouvesDto {
  constructor(dto: FarmingItemV2YouvesDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemV2YouvesDto];
    }
  }
}
