import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { ZERO_AMOUNT } from '@config/constants';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { COINFLIP_TOKENS_TO_PLAY, QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { toReal, defined, placeDecimals } from '@shared/helpers';
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
import { getBidSize } from '../helpers';
import { DashboardGeneralStats, GamersStats, GamersStatsRaw, UserLastGame, UserLastGameRaw } from '../interfaces';
import { DEFAULT_GENERAL_STATS, generalStatsMapping, userLastGameMapper, gamersStatsMapper } from '../mapping';
import { TokenWon } from '../types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  Head = 'head',
  Tail = 'tail'
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
  isLoading = false;
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

  readonly generalStatsStore = new LoadingErrorData<Nullable<GeneralStatsInterface>, DashboardGeneralStats>(
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
      tokensWithReward: computed,
      generalStats: computed,
      gamersStats: computed,
      userLastGame: computed,
      isGamersStatsLoading: computed,
      isUserLastGameLoading: computed,

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

  get generalStats(): Nullable<DashboardGeneralStats> {
    return this.generalStatsStore.data;
  }

  get isGamersStatsLoading() {
    return this.gamersStatsInfo.isLoading;
  }
  get isGeneralStatsLoading() {
    return this.generalStatsStore.isLoading;
  }

  get userLastGame(): Nullable<UserLastGame> {
    return this.userLastGameInfo.data;
  }
  get isUserLastGameLoading() {
    return this.userLastGameInfo.isLoading;
  }

  get tokensWithReward(): Nullable<TokenWon[]> {
    return this.tokensWon?.filter(item => item.amount?.isGreaterThan('0')) ?? [];
  }

  get bidSize() {
    return getBidSize(this.generalStats?.bank, this.generalStats?.maxBetPercent);
  }

  get payout(): Nullable<BigNumber> {
    return this.game.input && this.generalStats?.payoutCoefficient
      ? placeDecimals(
          this.game.input.times(toReal(this.generalStats.payoutCoefficient, COINFLIP_CONTRACT_DECIMALS)),
          this.token
        )
      : null;
  }

  get token(): Token {
    return this.tokenToPlay === TokenToPlay.Tezos ? TEZOS_TOKEN : QUIPU_TOKEN;
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

  startLoading() {
    this.isLoading = true;
  }

  finishLoading() {
    this.isLoading = false;
  }

  private async getGamesCount() {
    const allTokens = [TEZOS_TOKEN, QUIPU_TOKEN];
    const gamesAmounts = await Promise.all(
      allTokens.map(async token =>
        getGamesCountByTokenApi(this.rootStore.tezos, defined(this.rootStore.authStore.accountPkh), token)
      )
    );

    return gamesAmounts.reduce((acc, item) => acc.plus(item), new BigNumber(ZERO_AMOUNT));
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
