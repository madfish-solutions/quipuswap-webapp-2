import { BigMapAbstraction } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface CoinflipStorage {
  admin: string;
  asset_to_id: BigMapAbstraction;
  gamers_stats: BigMapAbstraction;
  games: BigMapAbstraction;
  id_to_asset: BigMapAbstraction;
  assets_counter: BigNumber;
  games_counter: BigNumber;
  network_bank: BigNumber;
  network_fee: BigNumber;
  server: string;
}

export interface GeneralStatsInterface {
  bank: BigNumber;
  games_count: BigNumber;
  payout_quot_f: BigNumber;
  total_won_amt: BigNumber;
}

export interface GamersStats {
  last_game_id: BigNumber;
  games_count: BigNumber;
  total_won_amt: BigNumber;
  total_lost_amt: BigNumber;
  total_bets_amt: BigNumber;
}

export enum TOKEN_ASSETS {
  TEZOS = 0,
  QUIPU = 1
}
