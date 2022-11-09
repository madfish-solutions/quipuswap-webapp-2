import { FARMING_FEES_PERCENTAGE_PRECISION } from '@config/constants';
import { FarmingListItemDto } from '@modules/farming/dto';
import { toReal } from '@shared/helpers';

export class FarmingListItemModel extends FarmingListItemDto {
  constructor(dto: FarmingListItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingListItemDto];
    }

    this.withdrawalFee = this.withdrawalFee && toReal(this.withdrawalFee, FARMING_FEES_PERCENTAGE_PRECISION);
  }
}
