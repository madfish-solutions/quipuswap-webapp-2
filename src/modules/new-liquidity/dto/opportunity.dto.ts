import { Typed } from '@shared/decorators';

import { Opportunity } from '../interfaces';

export class OpportunityDto implements Opportunity {
  @Typed()
  id: string;

  @Typed()
  apr: number;

  @Typed()
  apy: number;
}
