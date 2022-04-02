import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, getTokenSymbol, isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import s from '@styles/CommonContainer.module.scss';

import { StateCurrencyAmount, StateDollarEquivalent } from '../state-components';

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
        <StateCurrencyAmount isError={isNull(rate)} amount={rate} currency={currencyOutputSymbol} />
      </div>
      <div className={s.usdEquityWrapper}>
        <StateDollarEquivalent isError={isNull(usdRate)} dollarEquivalent={usdRate} />
      </div>
    </div>
  );
};
