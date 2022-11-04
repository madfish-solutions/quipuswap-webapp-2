import { Optional } from '@shared/types';

import { FarmVersion } from '../interfaces';

export const mapFarmVersion = (farmVersion: Optional<string>): FarmVersion => {
  switch (farmVersion) {
    case 'v1':
      return FarmVersion.v1;
    case 'v2':
      return FarmVersion.v2;
    case 'v3':
      return FarmVersion.v3;
    default:
      throw new Error(`Unknown farm version: ${farmVersion}`);
  }
};
