import { FarmingItemV2YouvesModel } from './farming-item-v2-youves.model';
import { FarmingItemV2YouvesResponseDto } from '../../dto';

export class YouvesFarmingItemResponseModel extends FarmingItemV2YouvesResponseDto {
  item: FarmingItemV2YouvesModel;

  constructor(dto: FarmingItemV2YouvesResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemV2YouvesResponseDto];
    }

    this.item = new FarmingItemV2YouvesModel(dto.item);
  }
}
