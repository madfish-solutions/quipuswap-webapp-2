import { FarmingListItemBalancesDto } from '../../dto';

export class FarmingListItemBalancesModel extends FarmingListItemBalancesDto {
  constructor(dto: FarmingListItemBalancesDto) {
    super();
    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingListItemBalancesDto];
    }
  }
}
