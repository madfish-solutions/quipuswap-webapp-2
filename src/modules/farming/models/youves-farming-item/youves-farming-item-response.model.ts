import { YouvesFarmingItemResponseDto } from '../../dto';
import { YouvesFarmingItemModel } from './youves-farming-item.model';

export class YouvesFarmingItemResponseModel extends YouvesFarmingItemResponseDto {
  item: YouvesFarmingItemModel;

  constructor(dto: YouvesFarmingItemResponseDto) {
    // eslint-disable-next-line no-console
    console.log('YouvesFarmingItemResponseModel', dto);
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesFarmingItemResponseDto];
    }

    this.item = new YouvesFarmingItemModel(dto.item);
  }
}
