import { LiquidityItemWrapDto } from '../dto';

export class LiquidityItemModel extends LiquidityItemWrapDto {
  constructor(dto: LiquidityItemWrapDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
