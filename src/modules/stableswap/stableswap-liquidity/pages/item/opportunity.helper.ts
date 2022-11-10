import { BigNumber } from 'bignumber.js';

import { Undefined } from '@shared/types';

import { getFarmItemUrl } from '../../../../farming/helpers';
import { FarmVersion } from '../../../../farming/interfaces';

const INDEX_INCREMENT = 1;

export const opportunityHelper = (
  { apr, ...props }: { apr: BigNumber; id: string; old: Undefined<boolean>; version: FarmVersion },
  index: number
) => ({
  apr,
  index: index + INDEX_INCREMENT,
  href: getFarmItemUrl(props)
});
