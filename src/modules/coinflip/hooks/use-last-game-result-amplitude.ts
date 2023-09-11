import { useCallback } from 'react';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TESTNET_EXCHANGE_RATE, TOKEN_DECIMALS_PRECISION } from '@config/constants';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';

import { useCoinflipStore } from './stores';
import { getGameResult } from '../helpers';

export const useLastGameResultAmplitude = () => {
  const coinflipStore = useCoinflipStore();

  const exchangeRates = useNewExchangeRates();
  const { log } = useAmplitudeService();

  const tokenSlug = getTokenSlug(coinflipStore?.token ?? '');
  const gameResult = getGameResult(coinflipStore?.userLastGame?.status);

  const lastGameLogEvent = useCallback(() => {
    const logData = {
      asset: coinflipStore?.tokenToPlay,
      amount: Number(coinflipStore?.userLastGame?.bidSize?.div(TOKEN_DECIMALS_PRECISION)),
      amountInUsd: Number(
        coinflipStore?.userLastGame?.bidSize
          ?.div(TOKEN_DECIMALS_PRECISION)
          .multipliedBy(IS_NETWORK_MAINNET ? exchangeRates[tokenSlug] : TESTNET_EXCHANGE_RATE)
      ),
      result: gameResult
    };

    log('LAST_GAME_RESULT', logData);
  }, [coinflipStore?.tokenToPlay, coinflipStore?.userLastGame?.bidSize, exchangeRates, gameResult, log, tokenSlug]);

  return { lastGameLogEvent };
};
