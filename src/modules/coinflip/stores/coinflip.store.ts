import { BigNumber } from 'bignumber.js';
import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_COINFLIP_CONTRACT, COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { isNull, fromDecimals } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { RootStore, LoadingErrorData } from '@shared/store';
import { Nullable, Token } from '@shared/types';

import { getCoinflipGeneralStatsApi } from '../api';
import { getGameUserInfoApi } from '../api/get-games-user-info.api';
import { GeneralStatsInterface } from '../api/types';
import { DashboardGeneralStats } from '../interfaces';
import { DEFAULT_GENERAL_STATS, generalStatsMapping } from '../mapping';
import { GameUserInfo } from '../types';

export enum TokenToPlay {
  Tezos = 'XTZ',
  Quipu = 'QUIPU'
}

const DEFAULT_TOKEN_TO_PLAY = TokenToPlay.Quipu;

// TODO: Rename to obverse / reverse
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

export class CoinflipStore {
  tokenToPlay: TokenToPlay = DEFAULT_TOKEN_TO_PLAY;

  game: CoinflipGame = { ...DEFAULT_COINFLIP_GAME };

  readonly gamesUserInfoStore = new LoadingErrorData<Nullable<GameUserInfo>, Nullable<GameUserInfo>>(
    null,
    async () => await this.getGameUserInfo(),
    noopMap
  );

  readonly generalStats = new LoadingErrorData<Nullable<GeneralStatsInterface>, DashboardGeneralStats>(
    DEFAULT_GENERAL_STATS,
    async () =>
      await getCoinflipGeneralStatsApi(this.rootStore.tezos, DEFAULT_COINFLIP_CONTRACT, this.token.contractAddress),
    generalStatsMapping
  );

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      tokenToPlay: observable,
      game: observable,

      payout: computed,
      token: computed,

      setToken: action,
      setInput: action
    });
  }

  get gameUserInfo() {
    return this.gamesUserInfoStore.data;
  }

  get userReward() {
    if (isNull(this.gameUserInfo)) {
      return null;
    }

    return this.gameUserInfo.tokensWon.reduce((accm, curr) => {
      // TODO: multiply by exchange rate
      return accm.plus(curr.amount);
    }, new BigNumber(0));
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

  private async getGameUserInfo() {
    return await getGameUserInfoApi();
  }
}
