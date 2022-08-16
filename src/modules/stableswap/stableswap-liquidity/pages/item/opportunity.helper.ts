import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';

export const opportunityHelper = ({ apr, id }: { apr: BigNumber; id: string }, index: number) => ({
  apr,
  index: index + 1,
  href: `${AppRootRoutes.Farming}/${id}`
});
