import { BigNumber } from 'bignumber.js';

import { Undefined } from '@shared/types';

import { FarmingListCommonResponseDto } from '../../dto';
import { FarmingItemCommonResponseModel, FarmingItemCommonModel } from '../farming-item';

export class FarmingListCommonResponseModel extends FarmingListCommonResponseDto {
  list: Array<FarmingItemCommonResponseModel>;
  indexedDictionary: { [id: string]: FarmingItemCommonModel };

  constructor(dto: FarmingListCommonResponseDto) {
    super();

    this.list = dto.list.map(data => new FarmingItemCommonResponseModel(data));
    this.indexedDictionary = Object.fromEntries(
      this.list.map(({ item }) => [this.getId(item.id, item.contractAddress), item])
    );
  }

  getId(id: BigNumber.Value, contractAddress: Undefined<string>) {
    return `${new BigNumber(id).toFixed()}-${contractAddress}`;
  }

  getFarmingItemModelById(id: string, contractAddress: string) {
    return this.indexedDictionary[this.getId(id, contractAddress)];
  }
}
