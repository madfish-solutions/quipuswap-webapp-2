import { FeeGrowthDto } from '../dto/fee-growth.dto';

export class FeeGrowthModel extends FeeGrowthDto {
  constructor(dto: FeeGrowthDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FeeGrowthDto];
    }
  }
}
