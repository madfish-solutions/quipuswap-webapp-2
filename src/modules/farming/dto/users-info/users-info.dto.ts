import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class UsersInfoDto {
  @Typed()
  last_staked: Date;

  @Typed()
  staked: BigNumber;

  @Typed()
  earned: BigNumber;

  @Typed()
  claimed: BigNumber;

  @Typed()
  prev_earned: BigNumber;

  @Typed()
  prev_staked: BigNumber;

  @Typed({ isArray: true, type: String })
  allowances: string[];
}
