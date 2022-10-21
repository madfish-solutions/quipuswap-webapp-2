import BigNumber from 'bignumber.js';

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

  get maxApr() {
    return BigNumber.max(this.apr, this.aprOneWeek, this.aprOneMonth, this.aprOneQuarter);
  }

  get tvl() {
    return toReal(this.atomicTvl, this.stakedToken);
  }

  get stableDividendsItemUrl() {
    return this.id.toFixed();
  }
}
