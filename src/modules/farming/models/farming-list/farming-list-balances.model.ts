import { FarmingListBalancesDto } from '../../dto';
import { FarmingListItemBalancesModel } from '../farming-item';

export class FarmingListBalancesModel extends FarmingListBalancesDto {
  balances: FarmingListItemBalancesModel[];
  indexedBalances: { [id: string]: FarmingListItemBalancesModel };

  constructor(dto: FarmingListBalancesDto) {
    super();

    this.balances = dto.balances.map(balance => new FarmingListItemBalancesModel(balance));
    this.indexedBalances = Object.fromEntries(this.balances.map(item => [item.id, item]));
  }

  getFarmingItemBalancesModelById(id: string) {
    return this.indexedBalances[id];
  }
}
