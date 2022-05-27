import { COINFLIP_CONTRACT_DECIMALS, COINFLIP_TOKEN_DECIMALS } from '@config/config';
import { bigNumberToString, fromDecimals } from '@shared/helpers';

import { useCoinflipStore } from '../../hooks';
import { DashboardGeneralStats } from '../../interfaces';

const mapping = ({ bank, gamesCount, payoutCoefficient, totalWins }: DashboardGeneralStats) => {
  return {
    bank: bank ? bigNumberToString(fromDecimals(bank, COINFLIP_TOKEN_DECIMALS)) : null,
    gamesCount: gamesCount ? bigNumberToString(gamesCount) : null,
    payoutCoefficient: payoutCoefficient
      ? bigNumberToString(fromDecimals(payoutCoefficient, COINFLIP_CONTRACT_DECIMALS))
      : null,
    totalWins: totalWins ? bigNumberToString(totalWins) : null
  };
};

export const useCoinflipDashboardStatsViewModel = () => {
  const { generalStats, tokenToPlay } = useCoinflipStore();
  const { bank, gamesCount, payoutCoefficient, totalWins } = mapping(generalStats.data);

  return { bank, gamesCount, payoutCoefficient, totalWins, tokenToPlay };
};
