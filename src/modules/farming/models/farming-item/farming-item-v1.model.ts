import { FARMING_FEES_PERCENTAGE_PRECISION } from '@config/constants';
import { toReal } from '@shared/helpers';

import { FarmingItemV1Dto } from '../../dto';

export class FarmingItemV1Model extends FarmingItemV1Dto {
  constructor(dto: FarmingItemV1Dto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemV1Dto];
    }

    this.harvestFee = toReal(this.harvestFee, FARMING_FEES_PERCENTAGE_PRECISION);
    this.withdrawalFee = toReal(this.withdrawalFee, FARMING_FEES_PERCENTAGE_PRECISION);
  }
}
