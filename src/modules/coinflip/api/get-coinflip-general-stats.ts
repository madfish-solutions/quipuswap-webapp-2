import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS } from '@config/config';
import { DEFAULT_TOKEN } from '@config/tokens';
import { getStorageInfo } from '@shared/dapp';
import { isEqual } from '@shared/helpers';

import { DashboardGeneralStats } from '../interfaces/dashboard-general-stats.interface';
import { CoinflipStorage } from './coinflip-contract.interface';

enum TOKEN_ASSETS {
  QUIPU = 0,
  TEZOS = 1
}

interface GeneralStatsInterface {
  bank: BigNumber;
  games_count: BigNumber;
  payout_quot_f: BigNumber;
  total_won_amt: BigNumber;
}

export const getCoinflipGeneralStats = async (
  tezos: TezosToolkit,
  contractAddress: string,
  tokenAddress: string
): Promise<Nullable<DashboardGeneralStats>> => {
  const tokenAsset = isEqual(tokenAddress, DEFAULT_TOKEN.contractAddress) ? TOKEN_ASSETS.QUIPU : TOKEN_ASSETS.TEZOS;
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);
  const generalStats = (await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset)) ?? null;

  if (!generalStats) {
    return null;
  }

  const { bank, games_count: gamesCount, payout_quot_f, total_won_amt: totalWins } = generalStats;
  const payoutCoefficient = payout_quot_f.div(COINFLIP_CONTRACT_DECIMALS);

  return { bank, gamesCount, payoutCoefficient, totalWins };
};
