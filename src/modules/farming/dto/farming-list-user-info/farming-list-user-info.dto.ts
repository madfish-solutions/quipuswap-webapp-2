import { BigNumber } from 'bignumber.js';

import { IFarmingListUsersInfoValueWithId } from '@modules/farming/helpers';
import { Typed } from '@shared/decorators';

export class FarmingListUserInfoDto implements IFarmingListUsersInfoValueWithId {
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
