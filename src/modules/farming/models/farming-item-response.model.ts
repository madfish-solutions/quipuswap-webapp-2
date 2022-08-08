import { FarmingItemResponseDto } from '../dto';
import { FarmingItemModel } from './farming-item.model';

export class FarmingItemResponseModel extends FarmingItemResponseDto {
  item: FarmingItemModel;

  constructor(dto: FarmingItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemResponseDto];
    }

    this.item = new FarmingItemModel(dto.item);
  }
}
