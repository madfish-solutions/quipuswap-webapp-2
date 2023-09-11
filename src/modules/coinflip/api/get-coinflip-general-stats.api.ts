import { TezosToolkit } from '@taquito/taquito';

import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import { CoinflipStorage, GeneralStatsInterface } from './types';
import { getCoinflipAssetId } from '../helpers';

export const getCoinflipGeneralStatsApi = async (
  tezos: Nullable<TezosToolkit>,
  contractAddress: string,
  token: Token
) => {
  if (isNull(tezos)) {
    return null;
  }

  const tokenAsset = getCoinflipAssetId(token);
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);

  const rawGeneralStats = await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset);

  if (!rawGeneralStats) {
    return null;
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
