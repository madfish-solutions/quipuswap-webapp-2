import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { ZERO_AMOUNT } from '@config/constants';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { COINFLIP_TOKENS_TO_PLAY, QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { toReal, defined, placeDecimals } from '@shared/helpers';
import { Led, ModelBuilder } from '@shared/model-builder';
import { NullableBigNumberWrapperModel } from '@shared/models/nullable-bignumber-wrapper.model';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import {
  getCoinflipGeneralStatsApi,
  getGamesCountByTokenApi,
  getTokenWonByTokenApi,
  getGamersStatsApi,
  getUserLastGameInfo
} from '../api';
import { getBidSize } from '../helpers';
import { DashboardGeneralStats, GamersStats, UserLastGame } from '../interfaces';
import { GamersStatsModel, GeneralStatsModel, LastGameModel, TokensWonListResponseModel } from '../models';
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

const DEFAULT_GENERAL_STATS = {
  bank: null,
  gamesCount: null,
  payoutCoefficient: null,
  totalWins: null,
  maxBetPercent: null
};

const DEFAULT_USER_LAST_GAME = {
  bidSize: null,
  betCoinSide: null,
  status: null
};

const DEFAULT_GAMERS_STATS = {
  lastGameId: null,
  gamesCount: null,
  totalWonAmount: null,
  totalLostAmount: null,
  totalBetsAmount: null
};

@ModelBuilder()
export class CoinflipStore {
  isLoading = false;
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;
  game: CoinflipGame = { ...DEFAULT_COINFLIP_GAME };
  pendingGameTokenToPlay = DEFAULT_TOKEN_TO_PLAY;

  //#region games count store
  @Led({
    default: { value: null },
    loader: async self => await self.getGamesCount(),
    model: NullableBigNumberWrapperModel
  })
  readonly gamesCountStore: LoadingErrorData<NullableBigNumberWrapperModel, { value: null }>;

  get gamesCount(): Nullable<BigNumber> {
    return this.gamesCountStore.model.value;
  }
  //#endregion games count store

  //#region tokens won store
  @Led({
    default: { list: null },
    loader: async self => await self.getTokensWon(),
    model: TokensWonListResponseModel
  })
  readonly tokensWonStore: LoadingErrorData<TokensWonListResponseModel, { list: null }>;

  get tokensWon(): Nullable<TokenWon[]> {
    return this.tokensWonStore.model.list;
  }

  get tokensWithReward(): Nullable<TokenWon[]> {
    return this.tokensWon?.filter(item => item.amount?.isGreaterThan('0')) ?? [];
  }
  //#endregion tokens won store

  //#region general stats store
  @Led({
    default: DEFAULT_GENERAL_STATS,
    loader: async self => await self.getCoinflipGeneralStats(),
    model: GeneralStatsModel
  })
  readonly generalStatsStore: LoadingErrorData<GeneralStatsModel, typeof DEFAULT_GENERAL_STATS>;

  get generalStats(): DashboardGeneralStats {
    return this.generalStatsStore.model;
  }

  get isGeneralStatsLoading() {
    return this.generalStatsStore.isLoading;
  }

  get bidSize() {
    return getBidSize(this.generalStats.bank, this.generalStats.maxBetPercent);
  }

  get payout(): Nullable<BigNumber> {
    return this.game.input && this.generalStats.payoutCoefficient
      ? placeDecimals(
          this.game.input.times(toReal(this.generalStats.payoutCoefficient, COINFLIP_CONTRACT_DECIMALS)),
          this.token
        )
      : null;
  }
  //#endregion general stats store

  //#region gamers stats info store
  @Led({
    default: DEFAULT_GAMERS_STATS,
    loader: async self => await self.getGamersStats(),
    model: GamersStatsModel
  })
  readonly gamersStatsInfo: LoadingErrorData<GamersStatsModel, typeof DEFAULT_GAMERS_STATS>;

  get gamersStats(): Nullable<GamersStats> {
    return this.gamersStatsInfo.model;
  }

  get isGamersStatsLoading() {
    return this.gamersStatsInfo.isLoading;
  }
  //#endregion gamers stats info store

  //#region user last game info store
  @Led({
    default: DEFAULT_USER_LAST_GAME,
    loader: async self => self.getUserLastGameInfo(),
    model: LastGameModel
  })
  readonly userLastGameInfo: LoadingErrorData<LastGameModel, typeof DEFAULT_USER_LAST_GAME>;

  get userLastGame(): UserLastGame {
    return this.userLastGameInfo.model;
  }

  get isUserLastGameLoading() {
    return this.userLastGameInfo.isLoading;
  }
  //#endregion user last game info store

  //#region pending game store
  @Led({
    default: DEFAULT_USER_LAST_GAME,
    loader: async self => self.getPendingGameInfo(),
    model: LastGameModel
  })
  readonly pendingGameStore: LoadingErrorData<LastGameModel, typeof DEFAULT_USER_LAST_GAME>;

  get pendingGame(): UserLastGame {
    return this.pendingGameStore.model;
  }
  //#endregion pending game store

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,
      gamersStatsInfo: observable,
      userLastGameInfo: observable,
      pendingGameTokenToPlay: observable,

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
      setInput: action,
      setPendingGameTokenToPlay: action
    });
  }

  get token(): Token {
    return this.tokenToPlay === TokenToPlay.Tezos ? TEZOS_TOKEN : QUIPU_TOKEN;
  }

  get pendingGameToken() {
    return this.pendingGameTokenToPlay === TokenToPlay.Tezos ? TEZOS_TOKEN : QUIPU_TOKEN;
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

  setPendingGameTokenToPlay(token: TokenToPlay) {
    this.pendingGameTokenToPlay = token;
  }

  async getGamesCount() {
    const allTokens = [TEZOS_TOKEN, QUIPU_TOKEN];
    const gamesAmounts = await Promise.all(
      allTokens.map(async token =>
        getGamesCountByTokenApi(this.rootStore.tezos, defined(this.rootStore.authStore.accountPkh), token)
      )
    );

    return {
      value: gamesAmounts.reduce((acc, item) => acc.plus(item), new BigNumber(ZERO_AMOUNT))
    };
  }

  async getTokensWon() {
    return {
      list: await Promise.all(
        COINFLIP_TOKENS_TO_PLAY.map(
          async (token: Token): Promise<TokenWon> =>
            await getTokenWonByTokenApi(this.rootStore.tezos, defined(this.rootStore.authStore.accountPkh), token)
        )
      )
    };
  }

  async getCoinflipGeneralStats() {
    return (
      (await getCoinflipGeneralStatsApi(this.rootStore.tezos, COINFLIP_CONTRACT_ADDRESS, this.token)) ??
      DEFAULT_GENERAL_STATS
    );
  }

  async getGamersStats() {
    return (
      (await getGamersStatsApi(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.token)) ??
      DEFAULT_GAMERS_STATS
    );
  }

  async getUserLastGameInfo() {
    return (
      (await getUserLastGameInfo(this.rootStore.tezos, this.gamersStatsInfo.model.lastGameId)) ?? DEFAULT_USER_LAST_GAME
    );
  }

  async getPendingGameInfo() {
    const gamersStats = await getGamersStatsApi(
      this.rootStore.tezos,
      this.rootStore.authStore.accountPkh,
      this.pendingGameToken
    );

    if (!gamersStats) {
      return DEFAULT_USER_LAST_GAME;
    }

    const lastGameInfo = await getUserLastGameInfo(this.rootStore.tezos, gamersStats.lastGameId);

    return lastGameInfo ?? DEFAULT_USER_LAST_GAME;
  }
}
