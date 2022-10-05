import { LiquidityItemResponseDto, LiquidityListDto } from '../dto';
import { LiquidityItemModel } from './liquidity-item.model';

export class LiquidityListModel extends LiquidityListDto {
  list: Array<LiquidityItemResponseDto>;

  constructor(dto: LiquidityListDto) {
    super();

    this.list = dto.list.map(item => new LiquidityItemModel(item));
  }
}
