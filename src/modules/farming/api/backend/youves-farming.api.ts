import { FARMING_YOUVES_LIST_API_URL } from '@config/constants';
import { YouvesFarmingItemDto } from '@modules/farming/dto';

export class BackendYouvesFarmingApi {
  static async getYouvesFarmingItem(farmId: string): Promise<YouvesFarmingItemDto> {
    const response = await fetch(`${FARMING_YOUVES_LIST_API_URL}/${farmId}`);

    return await response.json();
  }
}
