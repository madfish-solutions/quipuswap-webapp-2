import { FarmingItemCommonResponseDto } from '../../dto';
import { FarmingItemCommonModel } from './farming-item-common.model';

export class FarmingItemCommonResponseModel extends FarmingItemCommonResponseDto {
  item: FarmingItemCommonModel;

  constructor(dto: FarmingItemCommonResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemCommonResponseDto];
    }

    this.item = new FarmingItemCommonModel(dto.item);
  }
}
