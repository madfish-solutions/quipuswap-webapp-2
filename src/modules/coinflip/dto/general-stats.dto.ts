import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class GeneralStatsDto {
  @Typed({ type: BigNumber, nullable: true })
  bank: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  gamesCount: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  payoutCoefficient: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  totalWins: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  maxBetPercent: Nullable<BigNumber>;
}
