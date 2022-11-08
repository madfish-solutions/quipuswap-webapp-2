import { BigNumber } from 'bignumber.js';

import { Undefined } from '@shared/types';

import { FarmingListResponseDto } from '../../dto';
import { FarmingListItemResponseModel, FarmingListItemModel } from '../farming-item';

export class FarmingListResponseModel extends FarmingListResponseDto {
  list: Array<FarmingListItemResponseModel>;
  indexedDictionary: { [id: string]: FarmingListItemModel };

  constructor(dto: FarmingListResponseDto) {
    super();

    this.list = dto.list.map(data => new FarmingListItemResponseModel(data));
    this.indexedDictionary = Object.fromEntries(
      this.list.map(({ item }) => [this.getId(item.id, item.contractAddress), item])
    );
  }

  getId(id: BigNumber.Value, contractAddress: Undefined<string>) {
    return contractAddress ? `${new BigNumber(id).toFixed()}-${contractAddress}` : new BigNumber(id).toFixed();
  }

  getFarmingItemModelById(id: string, contractAddress?: string) {
    return this.indexedDictionary[this.getId(id, contractAddress)];
  }
}
