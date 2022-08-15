import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class UsersInfoDto {
  @Typed()
  last_staked: Date;

  @Typed({ type: BigNumber })
  staked: BigNumber;

  @Typed({ type: BigNumber })
  earned: BigNumber;

  @Typed({ type: BigNumber })
  claimed: BigNumber;

  @Typed({ type: BigNumber })
  prev_earned: BigNumber;

  @Typed({ type: BigNumber })
  prev_staked: BigNumber;

  @Typed({ isArray: true, type: String })
  allowances: string[];
}
