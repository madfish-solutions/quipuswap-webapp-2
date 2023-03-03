import { toReal } from '@shared/helpers';

import { StableswapDividendsItemDto } from '../dto';

export class StableswapDividendsItemModel extends StableswapDividendsItemDto {
  constructor(dto: StableswapDividendsItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StableswapDividendsItemDto];
    }
  }

  get tvl() {
    return toReal(this.atomicTvl, this.stakedToken);
  }

  get stableDividendsItemUrl() {
    return this.id.toFixed();
  }
}
