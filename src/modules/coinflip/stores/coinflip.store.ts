import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { DashboardGeneralStatsMapped } from '../interfaces';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  A = 'A',
  B = 'B'
}

export interface CoinflipGame {
  coinSide: Nullable<CoinSide>;
  input: Nullable<BigNumber>;
}

const DEFAULT_COINFLIP_GAME: CoinflipGame = {
  coinSide: null,
  input: null
};

export const DEFAULT_GENERAL_STATS: DashboardGeneralStatsMapped = {
  bank: null,
  gamesCount: null,
  payoutCoefficient: null,
  totalWins: null
};

export class CoinflipStore {
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;

  game: CoinflipGame = { ...DEFAULT_COINFLIP_GAME };

  generalStats: DashboardGeneralStatsMapped = DEFAULT_GENERAL_STATS;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,
      generalStats: observable,

      payout: computed,
      token: computed,

      setToken: action,
      setInput: action,
      setGeneralStats: action
    });
  }

  get payout(): Nullable<BigNumber> {
    return this.game.input ? this.game.input.times(Number(this.generalStats.payoutCoefficient)) : null;
  }

  get token(): Token {
    if (this.tokenToPlay === TokenToPlay.Tezos) {
      return TEZOS_TOKEN;
    }

    return DEFAULT_TOKEN;
  }

  setToken(token: TokenToPlay) {
    this.tokenToPlay = token;
    this.game = { ...DEFAULT_COINFLIP_GAME };
  }

  setCoinSide(coinSide: CoinSide) {
    this.game.coinSide = coinSide;
  }

  setInput(input: Nullable<BigNumber>) {
    this.game.input = input;
  }

  setGeneralStats(stats: DashboardGeneralStatsMapped) {
    this.generalStats = stats;
  }
}
