import { FarmingListCommonResponseDto } from '../../dto';
import { FarmingItemCommonResponseModel, FarmingItemCommonModel } from '../farming-item';

export class FarmingListCommonResponseModel extends FarmingListCommonResponseDto {
  list: Array<FarmingItemCommonResponseModel>;
  indexedDictionary: { [id: string]: FarmingItemCommonModel };

  constructor(dto: FarmingListCommonResponseDto) {
    super();

    this.list = dto.list.map(data => new FarmingItemCommonResponseModel(data));
    this.indexedDictionary = Object.fromEntries(this.list.map(({ item }) => [item.id.toFixed(), item]));
  }

  getFarmingItemModelById(id: string) {
    return this.indexedDictionary[id];
  }
}
