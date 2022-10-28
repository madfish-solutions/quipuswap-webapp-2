import { FARMING_API_URL } from '@config/environment';

export class BackendYouvesFarmingApi {
  static async getYouvesFarmingItem(id: string) {
    const youvesFarmRaw = await fetch(`${FARMING_API_URL}/v3/multi/${id}`);

    return await youvesFarmRaw.json();
  }
}
