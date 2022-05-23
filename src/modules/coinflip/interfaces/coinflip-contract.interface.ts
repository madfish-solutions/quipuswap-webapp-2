import { BigMapAbstraction } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface CoinflipStorage {
  admin: string;
  asset_to_id: BigMapAbstraction;
  gamer_stats: BigMapAbstraction;
  games: BigMapAbstraction;
  id_to_asset: BigMapAbstraction;
  assets_counter: BigNumber;
  games_counter: BigNumber;
  network_bank: BigNumber;
  network_fee: BigNumber;
  server: string;
}
