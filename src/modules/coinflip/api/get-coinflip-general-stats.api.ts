import { TezosToolkit } from '@taquito/taquito';

import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import { getCoinflipAssetId } from '../helpers';
import { CoinflipStorage, GeneralStatsInterface } from './types';

export const DEFAULT_GENERAL_STATS = {
  bank: null,
  gamesCount: null,
  payoutCoefficient: null,
  totalWins: null,
  maxBetPercent: null
};

export const getCoinflipGeneralStatsApi = async (
  tezos: Nullable<TezosToolkit>,
  contractAddress: string,
  token: Token
) => {
  if (isNull(tezos)) {
    return DEFAULT_GENERAL_STATS;
  }

  const tokenAsset = getCoinflipAssetId(token);
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);

  const rawGeneralStats = await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset);

  if (!rawGeneralStats) {
    return DEFAULT_GENERAL_STATS;
  }

  const {
    bank,
    games_count: gamesCount,
    payout_quot_f: payoutCoefficient,
    total_won_amt: totalWins,
    max_bet_percent_f: maxBetPercent
  } = rawGeneralStats;

  return {
    bank,
    gamesCount,
    payoutCoefficient,
    totalWins,
    maxBetPercent
  };
};
