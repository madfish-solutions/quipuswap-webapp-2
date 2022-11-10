import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { FarmVersion } from '../../farming/interfaces';
import { Opportunity } from '../types';

export class OpportunityDto implements Opportunity {
  @Typed()
  id: string;

  @Typed()
  apr: BigNumber;

  @Typed()
  apy: BigNumber;

  @Typed({ isEnum: true })
  version: FarmVersion;

  @Typed({ optional: true })
  /** @deprecated */
  old: boolean;
}
