import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { tokenAssetsMap } from '@config/coinflip';
import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { isNull, fromDecimals, defined } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { getCoinflipGeneralStatsApi, getGamesCountByTokenApi, getTokenWonByTokenApi } from '../api';
import { GeneralStatsInterface } from '../api/types';
import { DashboardGeneralStats } from '../interfaces';
import { DEFAULT_GENERAL_STATS, generalStatsMapping } from '../mapping';
import { GameUserInfo, TokenWon } from '../types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  A = 'head',
  B = 'tail'
}

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

  readonly gamesCountStore = new LoadingErrorData<Nullable<BigNumber>, Nullable<BigNumber>>(
    null,
    async () => await this.getGamesCount(),
    noopMap
  );

  readonly tokenWonStore = new LoadingErrorData<Nullable<TokenWon>, Nullable<TokenWon>>(
    null,
    async () => await this.getTokenWon(),
    noopMap
  );

  readonly tokensWonStore = new LoadingErrorData<Nullable<TokenWon[]>, Nullable<TokenWon[]>>(
    null,
    async () => await this.getTokensWon(),
    noopMap
  );

  readonly generalStats = new LoadingErrorData<Nullable<GeneralStatsInterface>, DashboardGeneralStats>(
    DEFAULT_GENERAL_STATS,
    async () => await getCoinflipGeneralStatsApi(this.rootStore.tezos, COINFLIP_CONTRACT_ADDRESS, this.token),
    generalStatsMapping
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,

      payout: computed,
      token: computed,
      gameUserInfo: computed,

      setToken: action,
      setInput: action
    });
  }

  get gameUserInfo(): GameUserInfo {
    const gamesCount = this.gamesCountStore.data;
    const tokensWon = this.tokensWonStore.data;

    return { gamesCount, tokensWon };
  }

  get payout(): Nullable<BigNumber> {
    return this.game.input && this.generalStats.data.payoutCoefficient
      ? this.game.input.times(
          Number(fromDecimals(this.generalStats.data.payoutCoefficient, COINFLIP_CONTRACT_DECIMALS))
        )
      : null;
  }

  get token(): Token {
    return this.tokenToPlay === TokenToPlay.Tezos ? TEZOS_TOKEN : DEFAULT_TOKEN;
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

  private async getGamesCount() {
    return await getGamesCountByTokenApi(
      this.rootStore.tezos,
      defined(this.rootStore.authStore.accountPkh, 'accountPkh'),
      this.token
    );
  }

  private async getTokenWon() {
    if (isNull(this.rootStore.authStore.accountPkh)) {
      return null;
    }

    return await getTokenWonByTokenApi(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.token);
  }

  private async getTokensWon() {
    if (isNull(this.rootStore.authStore.accountPkh)) {
      return null;
    }
    const values = [...tokenAssetsMap.values()];

    return Promise.all(
      values.map(async ({ token }) => {
        return await getTokenWonByTokenApi(this.rootStore.tezos, defined(this.rootStore.authStore.accountPkh), token);
      })
    );
  }
}
