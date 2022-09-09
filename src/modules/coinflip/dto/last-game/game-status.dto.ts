import { Typed } from '@shared/decorators';

export class GameStatusDto {
  @Typed({ optional: true })
  lost?: symbol;

  @Typed({ optional: true })
  started?: symbol;

  @Typed({ optional: true })
  won?: symbol;
}
