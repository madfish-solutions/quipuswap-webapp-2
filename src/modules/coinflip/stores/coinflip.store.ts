import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { COINFLIP_TOKENS_TO_PLAY, QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { toReal, defined } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Led, ModelBuilder } from '@shared/model-builder';
import { NullableBigNumberWrapperModel } from '@shared/models';
import { RootStore, LoadingErrorDataNew, LoadingErrorData } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import {
  getCoinflipGeneralStatsApi,
  getGamesCountByTokenApi,
  getTokenWonByTokenApi,
  getGamersStatsApi,
  getUserLastGameInfo,
  DEFAULT_GENERAL_STATS,
  DEFAULT_GAMERS_STATS,
  DEFAULT_USER_LAST_GAME
} from '../api';
import { getBidSize } from '../helpers';
import { DashboardGeneralStats, GamersStats, UserLastGame } from '../interfaces';
import { /* GamersStatsModel, GeneralStatsModel, LastGameModel, */ TokensWonListResponseModel } from '../models';
import { TokenWon } from '../types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

export enum CoinSide {
  Face = 'head',
  Back = 'tail'
}

export interface CoinflipGame {
  coinSide: Nullable<CoinSide>;
  input: Nullable<BigNumber>;
}

const DEFAULT_COINFLIP_GAME: CoinflipGame = {
  coinSide: null,
  input: null
};

@ModelBuilder()
export class CoinflipStore {
  isLoading = false;
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;
  game: CoinflipGame = { ...DEFAULT_COINFLIP_GAME };

  @Led({
    default: { value: null },
    loader: async self => await self.getGamesCount(),
    model: NullableBigNumberWrapperModel
  })
  readonly gamesCountStore: LoadingErrorDataNew<NullableBigNumberWrapperModel, { value: null }>;

  @Led({
    default: { list: null },
    loader: async self => await self.getTokensWon(),
    model: TokensWonListResponseModel
  })
  readonly tokensWonStore: LoadingErrorDataNew<TokensWonListResponseModel, { list: null }>;

  /* @Led({
    default: DEFAULT_GENERAL_STATS,
    loader: async self => await self.getCoinflipGeneralStats(),
    model: GeneralStatsModel
  })
  readonly generalStatsStore: LoadingErrorDataNew<GeneralStatsModel, typeof DEFAULT_GENERAL_STATS>; */
  readonly generalStatsStore = new LoadingErrorData<DashboardGeneralStats, DashboardGeneralStats>(
    DEFAULT_GENERAL_STATS,
    async () => await getCoinflipGeneralStatsApi(this.rootStore.tezos, COINFLIP_CONTRACT_ADDRESS, this.token),
    noopMap
  );

  /* @Led({
    default: DEFAULT_GAMERS_STATS,
    loader: async self => getGamersStatsApi(self.rootStore.tezos, self.rootStore.authStore.accountPkh, self.token),
    model: GamersStatsModel
  })
  readonly gamersStatsInfo: LoadingErrorDataNew<GamersStatsModel, typeof DEFAULT_GAMERS_STATS>; */
  readonly gamersStatsInfo = new LoadingErrorData<GamersStats, GamersStats>(
    DEFAULT_GAMERS_STATS,
    async () => await getGamersStatsApi(this.rootStore.tezos, this.rootStore.authStore.accountPkh, this.token),
    noopMap
  );

  /* @Led({
    default: DEFAULT_USER_LAST_GAME,
    loader: async self => getUserLastGameInfo(self.rootState.tezos, self.gamersStatsInfo.model.lastGameId),
    model: LastGameModel
  })
  readonly userLastGameInfo: LoadingErrorDataNew<LastGameModel, typeof DEFAULT_USER_LAST_GAME>; */
  readonly userLastGameInfo = new LoadingErrorData<UserLastGame, UserLastGame>(
    DEFAULT_USER_LAST_GAME,
    async () => await getUserLastGameInfo(this.rootStore.tezos, this.gamersStatsInfo.data?.lastGameId ?? null),
    noopMap
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
    return this.gamesCountStore.model.value;
  }

  get tokensWon(): Nullable<TokenWon[]> {
    return this.tokensWonStore.model.list;
  }

  /* get gamersStats(): Nullable<GamersStats> {
    return this.gamersStatsInfo.model;
  } */
  get gamersStats(): Nullable<GamersStats> {
    return this.gamersStatsInfo.data;
  }

  /* get generalStats(): DashboardGeneralStats {
    return this.generalStatsStore.model;
  } */
  get generalStats(): DashboardGeneralStats {
    return this.generalStatsStore.data;
  }

  get isGamersStatsLoading() {
    return this.gamersStatsInfo.isLoading;
  }
  get isGeneralStatsLoading() {
    return this.generalStatsStore.isLoading;
  }

  /* get userLastGame(): UserLastGame {
    return this.userLastGameInfo.model;
  } */
  get userLastGame(): UserLastGame {
    return this.userLastGameInfo.data;
  }

  get isUserLastGameLoading() {
    return this.userLastGameInfo.isLoading;
  }

  get tokensWithReward(): Nullable<TokenWon[]> {
    return this.tokensWon?.filter(item => item.amount?.isGreaterThan('0')) ?? [];
  }

  get bidSize() {
    return getBidSize(this.generalStats.bank, this.generalStats.maxBetPercent);
  }

  get payout(): Nullable<BigNumber> {
    return this.game.input && this.generalStats.payoutCoefficient
      ? this.game.input.times(Number(toReal(this.generalStats.payoutCoefficient, COINFLIP_CONTRACT_DECIMALS)))
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

  async getGamesCount() {
    return {
      value: await getGamesCountByTokenApi(
        this.rootStore.tezos,
        defined(this.rootStore.authStore.accountPkh),
        this.token
      )
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
}
