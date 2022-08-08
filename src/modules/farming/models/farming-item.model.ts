import { FarmingItemDto } from '../dto';

export class FarmingItemModel extends FarmingItemDto {
  constructor(dto: FarmingItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemDto];
    }
  }
}
