import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class GamersStatsDto {
  @Typed({ type: BigNumber, nullable: true })
  lastGameId: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  gamesCount: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  totalWonAmount: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  totalLostAmount: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  totalBetsAmount: Nullable<BigNumber>;
}
