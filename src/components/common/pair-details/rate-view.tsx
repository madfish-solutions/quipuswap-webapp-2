import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StateDollarEquivalent } from '@components/ui/state-components/state-dollar-equivalent';
import { useNewExchangeRates } from '@hooks/use-new-exchange-rate';
import s from '@styles/CommonContainer.module.sass';
import { getTokenSlug, getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

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
      <div className={s.rateView}>
        <StateCurrencyAmount amount="1" currency={getWhitelistedTokenSymbol(inputToken)} />

        <span className={s.equal}>=</span>

        <StateCurrencyAmount amount={rate} currency={getWhitelistedTokenSymbol(outputToken)} />
      </div>

      <div className={s.usdEquityWrapper}>
        <StateDollarEquivalent dollarEquivalent={usdRate} />
      </div>
    </div>
  );
};
