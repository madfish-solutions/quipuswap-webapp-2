import { StableswapDividendsItemModel } from './stableswap-dividends-item.model';
import { StableswapDividendsListDto } from '../dto';

export class StableswapDividendsListModel extends StableswapDividendsListDto {
  list: Array<StableswapDividendsItemModel>;

  constructor(dto: StableswapDividendsListDto) {
    super();

    this.list = dto.list.map(item => new StableswapDividendsItemModel(item));
  }
}
