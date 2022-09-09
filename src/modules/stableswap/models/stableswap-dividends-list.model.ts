import { StableswapDividendsListDto } from '../dto';
import { StableswapDividendsItemModel } from './stableswap-dividends-item.model';

export class StableswapDividendsListModel extends StableswapDividendsListDto {
  list: Array<StableswapDividendsItemModel>;

  constructor(dto: StableswapDividendsListDto) {
    super();

    this.list = dto.list.map(item => new StableswapDividendsItemModel(item));
  }
}
