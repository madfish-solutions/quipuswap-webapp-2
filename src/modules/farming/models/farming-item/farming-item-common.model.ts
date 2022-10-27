import { FARMING_FEES_PERCENTAGE_PRECISION } from '@config/constants';
import { FarmingItemCommonDto } from '@modules/farming/dto';
import { toReal } from '@shared/helpers';

export class FarmingItemCommonModel extends FarmingItemCommonDto {
  constructor(dto: FarmingItemCommonDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemCommonDto];
    }

    this.withdrawalFee = this.withdrawalFee && toReal(this.withdrawalFee, FARMING_FEES_PERCENTAGE_PRECISION);
  }
}
