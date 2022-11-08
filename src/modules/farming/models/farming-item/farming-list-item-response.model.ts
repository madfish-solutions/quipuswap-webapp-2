import { FarmingListItemResponseDto } from '../../dto';
import { FarmingListItemModel } from './farming-list-item.model';

export class FarmingListItemResponseModel extends FarmingListItemResponseDto {
  item: FarmingListItemModel;

  constructor(dto: FarmingListItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingListItemResponseDto];
    }

    this.item = new FarmingListItemModel(dto.item);
  }
}
