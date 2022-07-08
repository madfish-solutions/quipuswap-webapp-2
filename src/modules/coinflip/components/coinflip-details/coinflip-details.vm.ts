import BigNumber from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS, COINFLIP_TOKEN_DECIMALS } from '@config/config';
import { useExchangeRates } from '@providers/use-new-exchange-rate';
import { bigNumberToString, fromDecimals, isNull } from '@shared/helpers';
import { useAuthStore } from '@shared/hooks';
import { Token } from '@shared/types';

import { getBetCoinSide, getGameResult, getTokenInstanceFromSymbol } from '../../helpers';
import { useCoinflipStore } from '../../hooks';
import { DashboardGeneralStats } from '../../interfaces';

const mapping = ({ bank, gamesCount, payoutCoefficient, totalWins }: DashboardGeneralStats, token: Token) => ({
  bank: bank ? bigNumberToString(fromDecimals(bank, COINFLIP_TOKEN_DECIMALS)) : null,
  gamesCount: gamesCount ? bigNumberToString(gamesCount) : null,
  payoutCoefficient: payoutCoefficient
    ? bigNumberToString(fromDecimals(payoutCoefficient, COINFLIP_CONTRACT_DECIMALS))
    : null,
  totalWins: totalWins ? fromDecimals(totalWins, token) : null
});

export const useCoinflipDetailsViewModel = () => {
  const exchangeRates = useExchangeRates();
  const { generalStats, tokenToPlay, gamersStats, userLastGame } = useCoinflipStore();
  const { accountPkh } = useAuthStore();

  const tokenInstance = getTokenInstanceFromSymbol(tokenToPlay);

  const { bank, gamesCount, payoutCoefficient, totalWins } = mapping(generalStats.data, tokenInstance);

  const tokenExchangeRate = exchangeRates?.find(
    rate => rate.tokenId === tokenInstance.fa2TokenId && tokenInstance.contractAddress === rate.tokenAddress
  );
  const bankBN = new BigNumber(bank ?? '0');
  const bankInUsd = bankBN.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const bidSize = userLastGame?.bidSize && fromDecimals(userLastGame.bidSize, tokenInstance);
  const bidSizeInUsd = accountPkh && bidSize?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const totalWinsInUsd = totalWins?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const rewardSize = bidSize?.multipliedBy(payoutCoefficient ?? '0');
  const rewardSizeInUsd = accountPkh && rewardSize?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const gameResult = getGameResult(userLastGame?.status);
  const betCoinSide = getBetCoinSide(userLastGame?.betCoinSide);
  const shouldHideData = isNull(accountPkh);

  return {
    bank,
    bidSize,
    totalWins,
    bankInUsd,
    rewardSize,
    gamesCount,
    gameResult,
    betCoinSide,
    tokenToPlay,
    bidSizeInUsd,
    shouldHideData,
    totalWinsInUsd,
    rewardSizeInUsd,
    payoutCoefficient,
    status: userLastGame?.status,
    lastGameId: gamersStats?.lastGameId
  };
};
