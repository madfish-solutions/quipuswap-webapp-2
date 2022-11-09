import { FarmingItemResponseDto } from '../../dto';
import { FarmingItemV1Model } from './farming-item-v1.model';

export class FarmingItemV1ResponseModel extends FarmingItemResponseDto {
  item: FarmingItemV1Model;

  constructor(dto: FarmingItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemResponseDto];
    }

    this.item = new FarmingItemV1Model(dto.item);
  }
}
