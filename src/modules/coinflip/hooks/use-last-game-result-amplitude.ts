import { useCallback } from 'react';

import { BigNumber } from 'bignumber.js';

import { IS_NETWORK_MAINNET } from '@config/config';
import { TOKEN_DECIMALS_PRECISION } from '@config/constants';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { Optional, Token } from '@shared/types';

import { getGameResult } from '../helpers';
import { Status } from '../interfaces';
import { TokenToPlay } from '../stores';

const MOCK_TESTNET_EXCHANGE_RATE = 1.5;

export const useLastGameResultAmplitude = (
  token: Token,
  tokenToPlay: TokenToPlay,
  bidSize: Optional<BigNumber>,
  status: Optional<Status>
) => {
  const exchangeRates = useNewExchangeRates();
  const tokenSlug = getTokenSlug(token ?? '');

  const gameResult = getGameResult(status);

  const lastGameLogEvent = useCallback(() => {
    const logData = {
      asset: tokenToPlay,
      amount: Number(bidSize?.div(TOKEN_DECIMALS_PRECISION)),
      amountInUsd: Number(
        bidSize
          ?.div(TOKEN_DECIMALS_PRECISION)
          .multipliedBy(IS_NETWORK_MAINNET ? exchangeRates[tokenSlug] : MOCK_TESTNET_EXCHANGE_RATE)
      ),
      result: gameResult
    };

    amplitudeService.logEvent('LAST_GAME_RESULT', logData);
  }, [bidSize, exchangeRates, gameResult, tokenSlug, tokenToPlay]);

  return { lastGameLogEvent };
};
