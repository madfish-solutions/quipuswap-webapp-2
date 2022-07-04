import BigNumber from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS, COINFLIP_TOKEN_DECIMALS } from '@config/config';
import { useExchangeRates } from '@providers/use-new-exchange-rate';
import { bigNumberToString, fromDecimals } from '@shared/helpers';

import { getTokenInstanceFromSymbol } from '../../helpers';
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
  const exchangeRates = useExchangeRates();

  const { bank, gamesCount, payoutCoefficient, totalWins } = mapping(generalStats.data);

  const tokenInstance = getTokenInstanceFromSymbol(tokenToPlay);
  const tokenExchangeRate = exchangeRates?.find(
    rate => rate.tokenId === tokenInstance.fa2TokenId && tokenInstance.contractAddress === rate.tokenAddress
  );
  const bankBN = new BigNumber(bank ?? '0');
  const bankInUsd = bankBN.multipliedBy(tokenExchangeRate?.exchangeRate ?? 0);

  return { bank, bankInUsd, gamesCount, payoutCoefficient, totalWins, tokenToPlay };
};
