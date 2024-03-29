import { useCallback, useEffect } from 'react';

import BigNumber from 'bignumber.js';

import { COINFLIP_CONTRACT_DECIMALS, COINFLIP_TOKEN_DECIMALS } from '@config/config';
import { QUIPU_TOKEN_DECIMALS_PRECISION } from '@config/tokens';
import { useRootStore } from '@providers/root-store-provider';
import { useExchangeRates } from '@providers/use-new-exchange-rate';
import { bigNumberToString, toReal, isNull } from '@shared/helpers';
import { useAuthStore, useOnBlock } from '@shared/hooks';
import { Token } from '@shared/types';

import { getBetCoinSide, getGameResult, getTokenInstanceFromSymbol } from '../../helpers';
import { useCoinflipGeneralStats, useCoinflipStore, useUserLastGame, useUserPendingGame } from '../../hooks';
import { DashboardGeneralStats } from '../../interfaces';

const mapping = ({ bank, gamesCount, payoutCoefficient, totalWins }: DashboardGeneralStats, token: Token) => ({
  bank: bank ? bigNumberToString(toReal(bank, COINFLIP_TOKEN_DECIMALS)) : null,
  gamesCount: gamesCount ? bigNumberToString(gamesCount) : null,
  payoutCoefficient: payoutCoefficient
    ? bigNumberToString(toReal(payoutCoefficient, COINFLIP_CONTRACT_DECIMALS))
    : null,
  totalWins: totalWins ? toReal(totalWins, token) : null
});

export const useCoinflipDetailsViewModel = () => {
  const exchangeRates = useExchangeRates();
  const { tezos } = useRootStore();
  const {
    generalStatsStore,
    tokenToPlay,
    gamersStats,
    userLastGame,
    isGamersStatsLoading,
    isGeneralStatsLoading,
    isUserLastGameLoading,
    bidSize: contractBidSize
  } = useCoinflipStore();
  const { accountPkh } = useAuthStore();
  const { loadUserLastGame } = useUserLastGame();
  const { getCoinflipGeneralStats } = useCoinflipGeneralStats();
  const { getUserPendingGame } = useUserPendingGame();

  const updateGeneralStats = useCallback(async () => {
    if (isNull(tezos)) {
      return;
    }

    await getCoinflipGeneralStats();
  }, [getCoinflipGeneralStats, tezos]);

  const updateUserLastGame = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    await loadUserLastGame();
  }, [accountPkh, tezos, loadUserLastGame]);

  const updateUserPendingGame = useCallback(async () => {
    if (isNull(tezos) || isNull(accountPkh)) {
      return;
    }

    await getUserPendingGame();
  }, [accountPkh, tezos, getUserPendingGame]);

  useEffect(() => {
    void updateUserLastGame();
    void updateUserPendingGame();
    void updateGeneralStats();
  }, [updateUserLastGame, updateGeneralStats, updateUserPendingGame]);

  useOnBlock(updateUserLastGame);
  useOnBlock(updateGeneralStats);
  useOnBlock(updateUserPendingGame);

  const tokenInstance = getTokenInstanceFromSymbol(tokenToPlay);

  const { bank, gamesCount, payoutCoefficient, totalWins } = mapping(generalStatsStore.model, tokenInstance);

  const tokenExchangeRate = exchangeRates?.find(
    rate => rate.tokenId === tokenInstance.fa2TokenId && tokenInstance.contractAddress === rate.tokenAddress
  );
  const bankBN = new BigNumber(bank ?? '0');
  const bankInUsd = bankBN.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const realBidSize = userLastGame.bidSize && toReal(userLastGame.bidSize, tokenInstance);
  const bidSizeInUsd = accountPkh && realBidSize?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const totalWinsInUsd = totalWins?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const rewardSize = realBidSize?.multipliedBy(payoutCoefficient ?? '0');
  const rewardSizeInUsd = accountPkh && rewardSize?.multipliedBy(tokenExchangeRate?.exchangeRate ?? '0');
  const gameResult = getGameResult(userLastGame.status);
  const betCoinSide = getBetCoinSide(userLastGame.betCoinSide);
  const shouldHideData = isNull(accountPkh);
  const preparedBidSize =
    Math.floor(Number(contractBidSize) * QUIPU_TOKEN_DECIMALS_PRECISION) / QUIPU_TOKEN_DECIMALS_PRECISION;

  return {
    bank,
    bidSize: realBidSize,
    preparedBidSize,
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
    isGamersStatsLoading: isNull(generalStatsStore) || isGeneralStatsLoading,
    isUserLastGameLoading: isNull(userLastGame) || isUserLastGameLoading || isGamersStatsLoading,
    status: userLastGame.status,
    lastGameId: gamersStats?.lastGameId
  };
};
