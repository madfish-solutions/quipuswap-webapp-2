import React, { FC } from 'react';

import { Slippage, CurrencyAmount } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import s from '@styles/CommonContainer.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  tokenAInput: BigNumber;
  tokenBInput: BigNumber;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  slippage?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

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

  const maxInvestedA = slippage && tokenAInput.multipliedBy(slippage);
  const maxInvestedB = slippage && tokenBInput.multipliedBy(slippage);

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Slippage')}
      </label>
      <Slippage handleChange={handleChange} placeholder={slippage?.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.receive}>
        {slippage && (
          <>
            <span className={s.receiveLabel}>Max invested A:</span>
            <CurrencyAmount amount={maxInvestedA?.toFixed()} currency={getWhitelistedTokenSymbol(tokenA)} />
            <span className={s.receiveLabel}>Max invested B:</span>
            <CurrencyAmount amount={maxInvestedB?.toFixed()} currency={getWhitelistedTokenSymbol(tokenB)} />
          </>
        )}
      </div>
    </>
  );
};
