import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getStorageInfo } from '@shared/dapp';
import { isEqual } from '@shared/helpers';

import { COINFLIP_CONTRACT_DECIMALS } from '../components/dashboard-general-stats-info/use-coinflip-dashboard-stats.vm';
import { CoinflipStorage } from '../interfaces/coinflip-contract.interface';
import { DashboardGeneralStats } from '../interfaces/dashboard-general-stats.interface';

enum TOKEN_ASSETS {
  QUIPU = 0,
  TEZOS = 1
}

const QUIPU_TOKEN_ADDRESS_ITHACANET = 'KT19363aZDTjeRyoDkSLZhCk62pS4xfvxo6c';

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
  const tokenAsset = isEqual(tokenAddress, QUIPU_TOKEN_ADDRESS_ITHACANET) ? TOKEN_ASSETS.QUIPU : TOKEN_ASSETS.TEZOS;
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);
  const generalStats = (await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset)) ?? null;

  if (!generalStats) {
    return null;
  }

  const { bank, games_count: gamesCount, payout_quot_f, total_won_amt: totalWins } = generalStats;
  const payoutCoefficient = payout_quot_f.div(COINFLIP_CONTRACT_DECIMALS);

  return { bank, gamesCount, payoutCoefficient, totalWins };
};
