import { FarmingItemBalancesDto } from '../dto';

export class FarmingItemBalancesModel extends FarmingItemBalancesDto {
  constructor(dto: FarmingItemBalancesDto) {
    super();
    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemBalancesDto];
    }
  }
}
