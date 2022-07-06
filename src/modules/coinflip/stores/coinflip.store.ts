import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';
import { COINFLIP_TOKENS_TO_PLAY, DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { fromDecimals, defined } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import {
  getCoinflipGeneralStatsApi,
  getGamesCountByTokenApi,
  getTokenWonByTokenApi,
  getGamersStatsApi,
  getUserLastGameInfo
} from '../api';
import { GeneralStatsInterface } from '../api/types';
import { DashboardGeneralStats, GamersStats, GamersStatsRaw, UserLastGame, UserLastGameRaw } from '../interfaces';
import { DEFAULT_GENERAL_STATS, generalStatsMapping, userLastGameMapper } from '../mapping';
import { gamersStatsMapper } from '../mapping/gamers-stats.map';
import { TokenWon } from '../types';

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

  readonly tokensWonStore = new LoadingErrorData<TokenWon[], Nullable<TokenWon[]>>(
    null,
    async () => await this.getTokensWon(),
    noopMap
  );

  readonly generalStats = new LoadingErrorData<Nullable<GeneralStatsInterface>, DashboardGeneralStats>(
    DEFAULT_GENERAL_STATS,
    async () => await getCoinflipGeneralStatsApi(this.rootStore.tezos, COINFLIP_CONTRACT_ADDRESS, this.token),
    generalStatsMapping
  );

  readonly gamersStatsInfo = new LoadingErrorData<Nullable<GamersStatsRaw>, Nullable<GamersStats>>(
    null,
    async () => await getGamersStatsApi(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.token),
    gamersStatsMapper
  );

  readonly userLastGameInfo = new LoadingErrorData<Nullable<UserLastGameRaw>, Nullable<UserLastGame>>(
    null,
    async () => await getUserLastGameInfo(this.rootStore.tezos, this.gamersStatsInfo.data?.lastGameId ?? null),
    userLastGameMapper
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,
      gamersStatsInfo: observable,
      userLastGameInfo: observable,

      payout: computed,
      token: computed,
      gamesCount: computed,
      tokensWon: computed,
      gamersStats: computed,

      setToken: action,
      setInput: action
    });
  }

  get gamesCount(): Nullable<BigNumber> {
    return this.gamesCountStore.data;
  }

  get tokensWon(): Nullable<TokenWon[]> {
    return this.tokensWonStore.data;
  }

  get gamersStats(): Nullable<GamersStats> {
    return this.gamersStatsInfo.data;
  }

  get userLastGame(): Nullable<UserLastGame> {
    return this.userLastGameInfo.data;
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

  setCoinSide(coinSide: Nullable<CoinSide>) {
    this.game.coinSide = coinSide;
  }

  setInput(input: Nullable<BigNumber>) {
    this.game.input = input;
  }

  private async getGamesCount() {
    return await getGamesCountByTokenApi(
      this.rootStore.tezos,
      defined(this.rootStore.authStore.accountPkh),
      this.token
    );
  }

  private async getTokensWon() {
    return Promise.all(
      COINFLIP_TOKENS_TO_PLAY.map(
        async (token: Token): Promise<TokenWon> =>
          await getTokenWonByTokenApi(this.rootStore.tezos, defined(this.rootStore.authStore.accountPkh), token)
      )
    );
  }
}
