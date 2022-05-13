import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { RootStore } from '@shared/store';
import { Nullable, Token } from '@shared/types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  A = 'A',
  B = 'B'
}

export interface TokenInfo {
  amount: Nullable<BigNumber>;
  usd: Nullable<BigNumber>;
}

const DEFAULT_TOKEN_INFO: TokenInfo = {
  amount: null,
  usd: null
};

export interface CoinflipGame {
  coinSide: Nullable<CoinSide>;
  input: Nullable<BigNumber>;
}

const DEFAULT_COINFLIP_GAME: CoinflipGame = {
  coinSide: null,
  input: null
};

export class CoinflipStore {
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;

  game: CoinflipGame = { ...DEFAULT_COINFLIP_GAME };

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,

      gameAmount: computed,
      gamePayout: computed,
      token: computed,

      setToken: action,
      setInput: action
    });
  }

  /*
  TODO
   */
  get gameAmount(): TokenInfo {
    return DEFAULT_TOKEN_INFO;
  }

  /*
  TODO
   */
  get gamePayout(): TokenInfo {
    return DEFAULT_TOKEN_INFO;
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
}
