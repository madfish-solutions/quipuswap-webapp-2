import { FC, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StateDollarEquivalent } from '@components/ui/state-components/state-dollar-equivalent';
import { useNewExchangeRates } from '@hooks/use-new-exchange-rate';
import s from '@styles/CommonContainer.module.sass';
import { getTokenSlug, getWhitelistedTokenSymbol } from '@utils/helpers';
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
