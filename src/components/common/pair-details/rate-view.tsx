import { FC } from 'react';

import { DollarEquivalent } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { CurrencyAmount } from '@components/common/currency-amount';
import { useNewExchangeRates } from '@hooks/use-new-exchange-rate';
import s from '@styles/CommonContainer.module.sass';
import { getTokenSlug, getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

const USD_DECIMALS = 2;

interface RateViewProps {
  rate: Nullable<BigNumber.Value>;
  inputToken: WhitelistedToken;
  outputToken: WhitelistedToken;
}

export const RateView: FC<RateViewProps> = ({ rate, inputToken, outputToken }) => {
  const exchangeRates = useNewExchangeRates();

  const outputTokenUsdExchangeRate = exchangeRates[getTokenSlug(outputToken)];
  const usdRate =
    outputTokenUsdExchangeRate && rate ? new BigNumber(rate).times(outputTokenUsdExchangeRate) : undefined;

  return (
    <div className={s.cellAmount}>
      {rate && (
        <>
          <div className={s.rateView}>
            <CurrencyAmount amount={1} currency={getWhitelistedTokenSymbol(inputToken)} />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount={rate} currency={getWhitelistedTokenSymbol(outputToken)} />
          </div>
          {usdRate && (
            <div className={s.usdEquityWrapper}>
              <DollarEquivalent dollarEquivalent={usdRate.toFixed(USD_DECIMALS)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
