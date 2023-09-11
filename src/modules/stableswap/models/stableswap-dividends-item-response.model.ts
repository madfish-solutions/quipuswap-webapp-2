import { StableswapDividendsItemModel } from './stableswap-dividends-item.model';
import { StableswapDividendsItemResponseDto } from '../dto';

export class StableswapDividendsItemResponseModel extends StableswapDividendsItemResponseDto {
  item: StableswapDividendsItemModel;

  constructor(dto: StableswapDividendsItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StableswapDividendsItemResponseDto];
    }
    this.item = new StableswapDividendsItemModel(dto.item);
  }
}
