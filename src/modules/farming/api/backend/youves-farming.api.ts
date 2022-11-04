import { FARMING_ITEM_API_URL_V2 } from '@config/constants';

import { FarmVersion } from '../../interfaces';

export class BackendYouvesFarmingApi {
  private static getFarmItemUrl(version: FarmVersion) {
    switch (version) {
      case FarmVersion.v1:
        throw new Error('Invalid youves farm version V1');
      case FarmVersion.v2:
        return FARMING_ITEM_API_URL_V2;
      case FarmVersion.v3:
        return FARMING_ITEM_API_URL_V2;
      default:
        throw new Error('Invalid youves farm version: ' + version);
    }
  }
  static async getYouvesFarmingItem(id: string, version: FarmVersion) {
    const youvesFarmRaw = await fetch(`${this.getFarmItemUrl(version)}/${id}`);

    return await youvesFarmRaw.json();
  }
}
