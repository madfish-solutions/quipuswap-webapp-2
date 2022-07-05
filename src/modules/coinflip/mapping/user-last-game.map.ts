import { UserLastGame, UserLastGameRaw } from '../interfaces';

export const userLastGameMapper = (userLastGame: Nullable<UserLastGameRaw>): UserLastGame => {
  return {
    bidSize: userLastGame?.bid_size ?? null,
    betCoinSide: userLastGame?.bet_coin_side ?? null,
    status: userLastGame?.status ?? null
  };
};
