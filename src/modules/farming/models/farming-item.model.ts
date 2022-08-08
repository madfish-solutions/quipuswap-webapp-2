import { FARMING_FEES_PERCENTAGE_PRECISION } from '@config/constants';
import { toReal } from '@shared/helpers';

import { FarmingItemDto } from '../dto';

export class FarmingItemModel extends FarmingItemDto {
  constructor(dto: FarmingItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemDto];
    }

    this.harvestFee = toReal(this.harvestFee, FARMING_FEES_PERCENTAGE_PRECISION);
    this.withdrawalFee = toReal(this.withdrawalFee, FARMING_FEES_PERCENTAGE_PRECISION);
  }
}
