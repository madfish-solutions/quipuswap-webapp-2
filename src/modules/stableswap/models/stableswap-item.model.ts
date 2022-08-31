import { BigNumber } from 'bignumber.js';

import { StableswapItemDto } from '../dto';

export class StableswapItemModel extends StableswapItemDto {
  constructor(dto: StableswapItemDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StableswapItemDto];
    }
  }

  get providersFee(): BigNumber {
    return this.fees.liquidityProvidersFee;
  }

  get devFee() {
    return this.fees.devFee;
  }

  get interfaceFee() {
    return this.fees.interfaceFee;
  }

  get stakersFee() {
    return this.fees.stakersFee;
  }
}
