import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class YouvesStakeDto {
  @Typed()
  id: BigNumber;

  @Typed()
  stake: BigNumber;

  @Typed()
  disc_factor: BigNumber;

  @Typed()
  age_timestamp: string;
}
