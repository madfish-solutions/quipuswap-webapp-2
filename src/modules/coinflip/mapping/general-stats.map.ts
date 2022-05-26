import { COINFLIP_CONTRACT_DECIMALS, COINFLIP_TOKEN_DECIMALS } from '@config/config';
import { bigNumberToString, fromDecimals } from '@shared/helpers';

import { DashboardGeneralStats } from '../interfaces';

export const generalStatsMapping = ({ bank, gamesCount, payoutCoefficient, totalWins }: DashboardGeneralStats) => {
  return {
    bank: bank ? bigNumberToString(fromDecimals(bank, COINFLIP_TOKEN_DECIMALS)) : null,
    gamesCount: gamesCount ? bigNumberToString(gamesCount) : null,
    payoutCoefficient: payoutCoefficient
      ? bigNumberToString(fromDecimals(payoutCoefficient, COINFLIP_CONTRACT_DECIMALS))
      : null,
    totalWins: totalWins ? bigNumberToString(totalWins) : null
  };
};
