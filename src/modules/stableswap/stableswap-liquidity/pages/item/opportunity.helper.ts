import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { isUndefined } from '@shared/helpers';
import { Undefined } from '@shared/types';

const INDEX_INCREMENT = 1;

export const opportunityHelper = (
  { apr, id, old }: { apr: BigNumber; id: string; old: Undefined<boolean> },
  index: number
) => ({
  apr,
  index: index + INDEX_INCREMENT,
  href:
    old || isUndefined(old)
      ? `${AppRootRoutes.Farming}${AppRootRoutes.VersionOne}/${id}`
      : `${AppRootRoutes.Farming}/${id}`
});
