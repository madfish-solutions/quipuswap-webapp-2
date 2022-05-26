import { GeneralStatsInterface } from '../api/types';
import { DashboardGeneralStats } from '../interfaces';

export const DEFAULT_GENERAL_STATS: DashboardGeneralStats = {
  bank: null,
  gamesCount: null,
  payoutCoefficient: null,
  totalWins: null
};

export const generalStatsMapping = (stats: Nullable<GeneralStatsInterface>): DashboardGeneralStats => {
  if (!stats) {
    return DEFAULT_GENERAL_STATS;
  }

  const { bank, games_count: gamesCount, payout_quot_f: payoutCoefficient, total_won_amt: totalWins } = stats;

  return { bank, gamesCount, payoutCoefficient, totalWins };
};
