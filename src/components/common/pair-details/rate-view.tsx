import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { AmountRule, StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StateDollarEquivalent } from '@components/ui/state-components/state-dollar-equivalent';
import { useNewExchangeRates } from '@hooks/use-new-exchange-rate';
import s from '@styles/CommonContainer.module.sass';
import { getTokenSlug, getTokenSymbol, isNull } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

interface RateViewProps {
  rate: Nullable<BigNumber.Value>;
  inputToken: Nullable<Token>;
  outputToken: Nullable<Token>;
}

export const RateView: FC<RateViewProps> = ({ rate, inputToken, outputToken }) => {
  const exchangeRates = useNewExchangeRates();

  const outputTokenUsdExchangeRate = outputToken ? exchangeRates[getTokenSlug(outputToken)] : null;

  const usdRate = outputTokenUsdExchangeRate && rate ? new BigNumber(rate).times(outputTokenUsdExchangeRate) : null;

  const currencyInputSymbol = inputToken ? getTokenSymbol(inputToken) : null;
  const currencyOutputSymbol = outputToken ? getTokenSymbol(outputToken) : null;

  return (
    <div className={s.cellAmount}>
      <div className={s.rateView}>
        <StateCurrencyAmount amount="1" currency={currencyInputSymbol} />
        <span className={s.equal}>=</span>
        <StateCurrencyAmount
          isError={isNull(rate)}
          amount={rate}
          currency={currencyOutputSymbol}
          amountRule={AmountRule.Balance}
        />
      </div>
      <div className={s.usdEquityWrapper}>
        <StateDollarEquivalent isError={isNull(usdRate)} dollarEquivalent={usdRate} />
      </div>
    </div>
  );
};
