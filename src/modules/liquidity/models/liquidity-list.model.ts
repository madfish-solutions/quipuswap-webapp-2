import { LiquidityListDto } from '../dto';
import { LiquidityItemModel } from './liquidity-item.model';

export class LiquidityListModel extends LiquidityListDto {
  list: Array<LiquidityItemModel>;

  constructor(dto: LiquidityListDto) {
    super();

    this.list = dto.list.map(item => new LiquidityItemModel(item));
  }
}
