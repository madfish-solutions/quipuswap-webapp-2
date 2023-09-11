import { FeeGrowthModel } from './fee-growth.model';
import { TickModel } from './tick.model';
import { LiquidityV3PositionDto } from '../dto';

export class LiquidityV3PositionModel extends LiquidityV3PositionDto {
  fee_growth_inside_last: FeeGrowthModel;
  lower_tick: TickModel;
  upper_tick: TickModel;

  constructor(dto: LiquidityV3PositionDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof LiquidityV3PositionDto];
    }
    this.fee_growth_inside_last = new FeeGrowthModel(dto.fee_growth_inside_last);
    this.lower_tick = new TickModel(dto.lower_tick);
    this.upper_tick = new TickModel(dto.upper_tick);
  }
}
