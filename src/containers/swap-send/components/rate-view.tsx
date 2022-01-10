import { FC, useMemo } from 'react';

import { CurrencyAmount, DollarEquivalent } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { useNewExchangeRates } from '@hooks/use-new-exchange-rate';
import s from '@styles/CommonContainer.module.sass';
import { getTokenSlug, getWhitelistedTokenSymbol } from '@utils/helpers';
import { FormatNumber } from '@utils/helpers/formatNumber';
import { WhitelistedToken } from '@utils/types';

interface RateViewProps {
  rate?: BigNumber;
  inputToken: WhitelistedToken;
  outputToken: WhitelistedToken;
}

export const RateView: FC<RateViewProps> = ({ rate, inputToken, outputToken }) => {
  const exchangeRates = useNewExchangeRates();

  const outputTokenUsdExchangeRate = exchangeRates[getTokenSlug(outputToken)];
  const usdRate = useMemo(
    () => (outputTokenUsdExchangeRate ? rate?.times(outputTokenUsdExchangeRate) : undefined),
    [outputTokenUsdExchangeRate, rate]
  );

  return (
    <div className={s.cellAmount}>
      {rate && (
        <>
          <div className={s.rateView}>
            <CurrencyAmount amount="1" currency={getWhitelistedTokenSymbol(inputToken)} />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount={FormatNumber(rate)} currency={getWhitelistedTokenSymbol(outputToken)} />
          </div>
          {usdRate && (
            <div className={s.usdEquityWrapper}>
              <DollarEquivalent dollarEquivalent={usdRate.toFixed(2)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
