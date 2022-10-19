import { YouvesFarmingItemDto } from '../../dto';

export class YouvesFarmingItemModel extends YouvesFarmingItemDto {
  constructor(dto: YouvesFarmingItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesFarmingItemDto];
    }
  }
}
