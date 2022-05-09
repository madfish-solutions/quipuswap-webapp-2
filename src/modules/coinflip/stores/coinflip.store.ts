import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { RootStore } from '@shared/store';
import { Nullable } from '@shared/types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  A = 'A',
  B = 'B'
}

interface TokenInfo {
  amount: Nullable<BigNumber>;
  usd: Nullable<BigNumber>;
}

const DEFAULT_TOKEN_INFO: TokenInfo = {
  amount: null,
  usd: null
};

export interface CoinflipGame {
  coinSide: Nullable<CoinSide>;
  input: string;
}

const DEFAULT_COINFLIP_GAME: CoinflipGame = {
  coinSide: null,
  input: ''
};

export class CoinflipStore {
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;
  tokenBalance: Nullable<BigNumber> = null;
  game: CoinflipGame = DEFAULT_COINFLIP_GAME;

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      tokenBalance: observable,
      game: observable,

      gameAmount: computed,
      gamePayout: computed,

      setToken: action,
      setBalance: action,
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

  setToken(token: TokenToPlay) {
    this.tokenToPlay = token;
  }

  setBalance(balance: Nullable<BigNumber>) {
    this.tokenBalance = balance;
  }

  setInput(input: string) {
    this.game.input = input;
  }
}
