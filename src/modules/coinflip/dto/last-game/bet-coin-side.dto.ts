import { Typed } from '@shared/decorators';

export class BetCoinSideDto {
  @Typed({ optional: true })
  head?: symbol;

  @Typed({ optional: true })
  tail?: symbol;
}
