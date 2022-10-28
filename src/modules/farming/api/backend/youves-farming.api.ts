import { FARMING_API_URL } from '@config/environment';
import { YouvesFarmingItemDto } from '@modules/farming/dto';

export class BackendYouvesFarmingApi {
  static async getYouvesFarmingItem(id: string): Promise<YouvesFarmingItemDto> {
    const youvesFarmRaw = await fetch(`${FARMING_API_URL}/v3/multi/${id}`);

    return await youvesFarmRaw.json();
  }
}
