import { StableswapListDto } from '../dto';
import { StableswapItemModel } from './stableswap-item.model';

export class StableswapListModel extends StableswapListDto {
  list: Array<StableswapItemModel>;

  constructor(dto: StableswapListDto) {
    super();

    this.list = dto.list.map(item => new StableswapItemModel(item));
  }
}
