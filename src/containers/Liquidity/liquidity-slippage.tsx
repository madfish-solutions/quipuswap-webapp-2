import React, { FC } from 'react';

import { Slippage } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { increaseBySlippage } from '@containers/Liquidity/LiquidityForms/helpers';
import s from '@styles/CommonContainer.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  tokenAInput: string;
  tokenBInput: string;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  slippage: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

const DEFAULT_INVESTED_VALUE = 0;

export const LiquiditySlippage: FC<SlippageInputProps> = ({
  error,
  tokenAInput,
  tokenBInput,
  tokenA,
  tokenB,
  slippage,
  onChange
}) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) => {
    onChange(newValue ? new BigNumber(newValue) : new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));
  };

  const tokenABN = new BigNumber(tokenAInput ? tokenAInput : DEFAULT_INVESTED_VALUE);
  const tokenBBN = new BigNumber(tokenBInput ? tokenBInput : DEFAULT_INVESTED_VALUE);

  const maxInvestedA = increaseBySlippage(tokenABN, slippage);
  const maxInvestedB = increaseBySlippage(tokenBBN, slippage);

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Slippage')}
      </label>
      <Slippage handleChange={handleChange} placeholder={slippage.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.amountsWrapper}>
        <span className={s.receiveLabel}>Max invested A:</span>
        <StateCurrencyAmount amount={maxInvestedA.toFixed()} currency={getWhitelistedTokenSymbol(tokenA)} />
      </div>
      <div className={s.amountsWrapper}>
        <span className={s.receiveLabel}>Max invested B:</span>
        <StateCurrencyAmount amount={maxInvestedB.toFixed()} currency={getWhitelistedTokenSymbol(tokenB)} />
      </div>
    </>
  );
};
