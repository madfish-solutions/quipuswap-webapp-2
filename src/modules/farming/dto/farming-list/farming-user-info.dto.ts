import { BigNumber } from 'bignumber.js';

import { UsersInfoValueWithId } from '@modules/farming/helpers';
import { Typed } from '@shared/decorators';

export class UserInfoDto implements UsersInfoValueWithId {
  @Typed()
  id: BigNumber;

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
  allowances: Array<string>;
}
