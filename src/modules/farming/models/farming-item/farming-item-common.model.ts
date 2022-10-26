import { FarmingItemCommonDto } from '@modules/farming/dto';

export class FarmingItemCommonModel extends FarmingItemCommonDto {
  constructor(dto: FarmingItemCommonDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemCommonDto];
    }
  }
}
