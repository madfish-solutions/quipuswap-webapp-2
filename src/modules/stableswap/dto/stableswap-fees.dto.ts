import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { Fees } from '../types';

export class StableswapFeesDto implements Fees {
  @Typed({ type: BigNumber })
  liquidityProvidersFee!: BigNumber;

  @Typed({ type: BigNumber })
  stakersFee!: BigNumber;

  @Typed({ type: BigNumber })
  interfaceFee!: BigNumber;

  @Typed({ type: BigNumber })
  devFee!: BigNumber;
}
