import { BigNumber } from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { FarmingRoutes } from '@modules/farming/farming.router';
import { Undefined } from '@shared/types';

import { FarmVersion } from '../../../../farming/interfaces';

const INDEX_INCREMENT = 1;

const getRoute = (version: FarmVersion): FarmingRoutes => {
  switch (version) {
    case FarmVersion.v1:
      return FarmingRoutes.VersionOne;
    case FarmVersion.v2:
      return FarmingRoutes.VersionOne;
    case FarmVersion.v3:
      return FarmingRoutes.VersionOne;
    default:
      throw new Error(`Unknown farm version: ${version}`);
  }
};

const getUrl = ({ id, version, old }: { id: string; old: Undefined<boolean>; version: FarmVersion }) => {
  const urlVersion = old ? FarmVersion.v1 : version;

  return `${AppRootRoutes.Farming}${getRoute(urlVersion)}/${id}`;
};

export const opportunityHelper = (
  { apr, ...props }: { apr: BigNumber; id: string; old: Undefined<boolean>; version: FarmVersion },
  index: number
) => ({
  apr,
  index: index + INDEX_INCREMENT,
  href: getUrl(props)
});
