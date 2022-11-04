import { AppRootRoutes } from '@app.router';
import { Undefined } from '@shared/types';

import { FarmingRoutes } from '../farming.router';
import { FarmVersion } from '../interfaces';

const getFarmingRoutes = (version: FarmVersion): FarmingRoutes => {
  switch (version) {
    case FarmVersion.v1:
      return FarmingRoutes.VersionOne;
    case FarmVersion.v2:
      return FarmingRoutes.VersionTwo;
    case FarmVersion.v3:
      return FarmingRoutes.VersionThree;
    default:
      throw new Error(`Unknown farm version: ${version}`);
  }
};

export const getFarmItemUrl = ({
  id,
  version,
  old
}: {
  id: string;
  old?: Undefined<boolean>;
  version: FarmVersion;
}) => {
  const urlVersion = old ? FarmVersion.v1 : version;

  return `${AppRootRoutes.Farming}/${getFarmingRoutes(urlVersion)}/${id}`;
};
