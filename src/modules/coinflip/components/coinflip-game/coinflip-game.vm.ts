import BigNumber from 'bignumber.js';

import { useAmountInUsd, useAmplitudeService, useTokenBalance } from '@shared/hooks';
import { Nullable } from '@shared/types';
import { useToasts } from '@shared/utils';

import { getGameResult, Statuses } from '../../helpers';
import { useCoinFlip, useCoinflipStore, useGamersStats, useUserLastGame, useUserPendingGame } from '../../hooks';
import { CoinSide } from '../../stores';

export const useCoinflipGameViewModel = () => {
  const coinflipStore = useCoinflipStore();
  const { tokenToPlay, game, token, payout, isLoading, isUserLastGameLoading, userLastGame } = coinflipStore;

  const tokenBalance = useTokenBalance(token) ?? null;

  const { getGamersStats } = useGamersStats();
  const { loadUserLastGame } = useUserLastGame();
  const { getUserPendingGame } = useUserPendingGame();
  const { handleCoinFlip: handleCoinFlipPure } = useCoinFlip();

  const { showErrorToast } = useToasts();
  const { getAmountInUsd } = useAmountInUsd();
  const { log } = useAmplitudeService();

  const handleSubmit = async (coinSide: string, input: BigNumber) => {
    coinflipStore.startLoading();

    const amountInUsd = getAmountInUsd(input, token);

    const logData = {
      asset: tokenToPlay,
      coinSide,
      amount: input.toNumber(),
      amountInUsd: amountInUsd
    };

    try {
      log('CLICK_FLIP_BUTTON_CLICK', logData);

      await handleCoinFlipPure(input, coinSide);
      coinflipStore.setPendingGameTokenToPlay(tokenToPlay);

      await getGamersStats();
      await loadUserLastGame();
      await getUserPendingGame();

      log('CLICK_FLIP_OPERATION_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);

      log('CLICK_FLIP_OPERATION_FAILED', {
        ...logData,
        error
      });
    }

    coinflipStore.finishLoading();
  };

  const handleSelectCoinSide = (coinSide: Nullable<CoinSide>) => {
    coinflipStore.setCoinSide(coinSide);
  };

  const handleAmountInputChange = (amountInput: string) => {
    const input = new BigNumber(amountInput);
    coinflipStore.setInput(!input.isNaN() ? input : null);
  };

  const gameResult = getGameResult(userLastGame.status);

  return {
    isLoading: isLoading || isUserLastGameLoading || gameResult === Statuses.started,
    tokenToPlay,
    tokenBalance,
    game,
    token,
    payout,
    handleSelectCoinSide,
    handleAmountInputChange,
    handleFormSubmit: handleSubmit
  };
};
