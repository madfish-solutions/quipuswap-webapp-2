import { FarmingListResponseDto } from '../../dto';
import { FarmingItemModel, FarmingItemResponseModel } from '../farming-item';

export class FarmingListResponseModel extends FarmingListResponseDto {
  list: Array<FarmingItemResponseModel>;
  indexedList: { [id: string]: FarmingItemModel };

  constructor(dto: FarmingListResponseDto) {
    super();

    this.list = dto.list.map(data => new FarmingItemResponseModel(data));
    this.indexedList = Object.fromEntries(this.list.map(({ item }) => [item.id.toFixed(), item]));
  }

  getFarmingItemModelById(id: string) {
    return this.indexedList[id];
  }
}
