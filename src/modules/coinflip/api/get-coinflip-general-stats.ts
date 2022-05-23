import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getStorageInfo } from '@shared/dapp';
import { isEqual } from '@shared/helpers';

import { COINFLIP_CONTRACT_DECIMALS } from '../components/dashboard-general-stats-info/use-coinflip-dashboard-stats.vm';
import { CoinflipStorage } from '../interfaces/coinflip-contract.interface';
import { DashboardGeneralStats } from '../interfaces/dashboard-general-stats.interface';

const TEZOS_TOKEN_ASSET = 0;
const QUIPU_TOKEN_ASSET = 1;

const QUIPU_TOKEN_ADDRESS_ITHACANET = 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb';

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
  const tokenAsset = isEqual(tokenAddress, QUIPU_TOKEN_ADDRESS_ITHACANET) ? QUIPU_TOKEN_ASSET : TEZOS_TOKEN_ASSET;
  const storage = await getStorageInfo<CoinflipStorage>(tezos, contractAddress);
  const generalStats = (await storage.id_to_asset.get<GeneralStatsInterface>(tokenAsset)) ?? null;

  if (!generalStats) {
    return null;
  }

  const { bank, games_count: gamesCount, payout_quot_f, total_won_amt: totalWins } = generalStats;
  const payoutCoefficient = payout_quot_f.div(COINFLIP_CONTRACT_DECIMALS);

  return { bank, gamesCount, payoutCoefficient, totalWins };
};
