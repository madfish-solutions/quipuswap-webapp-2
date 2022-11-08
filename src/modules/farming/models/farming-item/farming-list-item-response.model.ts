import { FarmingItemCommonResponseDto } from '../../dto';
import { FarmingListItemModel } from './farming-list-item.model';

export class FarmingListItemResponseModel extends FarmingItemCommonResponseDto {
  item: FarmingListItemModel;

  constructor(dto: FarmingItemCommonResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemCommonResponseDto];
    }

    this.item = new FarmingListItemModel(dto.item);
  }
}
