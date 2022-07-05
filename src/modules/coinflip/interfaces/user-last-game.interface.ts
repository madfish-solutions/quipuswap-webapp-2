import BigNumber from 'bignumber.js';

export interface BetCoinSide {
  head: symbol;
  tail: symbol;
}

export interface Status {
  lost: symbol;
  started: symbol;
  won: symbol;
}

export interface UserLastGameRaw {
  asset_id: BigNumber;
  gamer: string;
  start: Date;
  bid_size: BigNumber;
  bet_coin_side: BetCoinSide;
  status: Status;
}

export interface UserLastGame {
  bidSize: Nullable<BigNumber>;
  betCoinSide: Nullable<BetCoinSide>;
  status: Nullable<Status>;
}
