import { FarmingListBalancesDto } from '../../dto';
import { FarmingItemBalancesModel } from '../farming-item';

export class FarmingListBalancesModel extends FarmingListBalancesDto {
  balances: FarmingItemBalancesModel[];
  indexedBalances: { [id: string]: FarmingItemBalancesModel };

  constructor(dto: FarmingListBalancesDto) {
    super();
    this.balances = dto.balances.map(balances => new FarmingItemBalancesModel(balances));
    this.indexedBalances = Object.fromEntries(this.balances.map(item => [item.id, item]));
  }

  getFarmingItemBalancesModelById(id: string) {
    return this.indexedBalances[id];
  }
}
