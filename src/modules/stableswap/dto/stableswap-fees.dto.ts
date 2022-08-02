import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { Fees } from '../types';

export class StableswapFeesDto implements Fees {
  @Typed()
  liquidityProvidersFee: BigNumber;

  @Typed()
  stakersFee: BigNumber;

  @Typed()
  interfaceFee: BigNumber;

  @Typed()
  devFee: BigNumber;
}
