import { TickDto } from '../dto/tick.dto';
import { FeeGrowthModel } from './fee-growth.model';

export class TickModel extends TickDto {
  fee_growth_outside: FeeGrowthModel;

  constructor(dto: TickDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof TickDto];
    }
    this.fee_growth_outside = new FeeGrowthModel(dto.fee_growth_outside);
  }
}
