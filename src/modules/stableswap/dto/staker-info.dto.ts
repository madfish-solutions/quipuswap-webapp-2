import { MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class StakerInfoDto {
  @Typed()
  yourDeposit: BigNumber;

  @Typed({ nullable: true, type: MichelsonMap })
  yourReward: Nullable<MichelsonMap<BigNumber, BigNumber>>;
}