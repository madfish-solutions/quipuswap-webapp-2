import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { getTokenSlug, getTokenSymbol, isNull } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { StateCurrencyAmount, StateDollarEquivalent } from '../state-components';

interface RateViewProps {
  rate: Nullable<BigNumber.Value>;
  inputToken: Nullable<Token>;
  outputToken: Nullable<Token>;
}

export const RateView: FC<RateViewProps> = ({ rate, inputToken, outputToken }) => {
  const exchangeRates: { [key: string]: number } = {}; // useNewExchangeRates();

  const outputTokenUsdExchangeRate = outputToken ? exchangeRates[getTokenSlug(outputToken)] : null;

  const usdRate = outputTokenUsdExchangeRate && rate ? new BigNumber(rate).times(outputTokenUsdExchangeRate) : null;

  const currencyInputSymbol = inputToken ? getTokenSymbol(inputToken) : null;
  const currencyOutputSymbol = outputToken ? getTokenSymbol(outputToken) : null;

  return (
    <div className={styles.cellAmount}>
      <div className={styles.rateView}>
        <StateCurrencyAmount amount="1" currency={currencyInputSymbol} />
        <span className={styles.equal}>=</span>
        <StateCurrencyAmount isError={isNull(rate)} amount={rate} currency={currencyOutputSymbol} />
      </div>
      <div className={styles.usdEquityWrapper}>
        <StateDollarEquivalent isError={isNull(usdRate)} dollarEquivalent={usdRate} />
      </div>
    </div>
  );
};
