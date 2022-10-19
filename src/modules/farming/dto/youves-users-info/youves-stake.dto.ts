import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class YouvesStakeDto {
  @Typed({ type: BigNumber })
  id: BigNumber;

  @Typed({ type: BigNumber })
  stake: BigNumber;

  @Typed({ type: BigNumber })
  disc_factor: BigNumber;

  @Typed()
  age_timestamp: string;
}
