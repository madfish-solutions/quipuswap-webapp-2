import { isExist } from '@shared/helpers';

import { FarmingListResponseDto } from '../../dto';
import { FarmingListItemResponseModel } from '../farming-list-item';

export class FarmingListResponseModel extends FarmingListResponseDto {
  list: Array<FarmingListItemResponseModel>;

  constructor(dto: FarmingListResponseDto) {
    super();

    this.list = dto.list.map(data => new FarmingListItemResponseModel(data));
  }

  getFarmingItemModelById(id: string, contractAddress?: string) {
    return (
      this.list
        .map(({ item }) => item)
        .find(item => {
          if (contractAddress) {
            return item.id === id && item.contractAddress === contractAddress;
          }

          return item.id === id && !isExist(item.contractAddress);
        }) ?? null
    );
  }
}
