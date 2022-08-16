import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { Opportunity } from '../types';

export class OpportunityDto implements Opportunity {
  @Typed()
  id: string;

  @Typed()
  apr: BigNumber;

  @Typed()
  apy: BigNumber;
}
