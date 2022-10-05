import { LiquidityItemResponseDto } from '../dto';

export class LiquidityItemModel extends LiquidityItemResponseDto {
  constructor(dto: LiquidityItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
