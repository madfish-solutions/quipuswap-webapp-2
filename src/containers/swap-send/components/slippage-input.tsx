import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import { Slippage } from '@components/common/Slippage';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { getMinimalOutput, getTokenSymbol } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  loading: boolean;
  outputAmount?: BigNumber;
  outputToken?: Token;
  slippage?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

export const SlippageInput: FC<SlippageInputProps> = ({
  error,
  outputAmount,
  onChange,
  slippage,
  outputToken,
  loading
}) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_SLIPPAGE_PERCENTAGE));

  const minimumReceived = getMinimalOutput(outputAmount, slippage, outputToken?.metadata.decimals ?? 0);

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
            <span className={s.receiveLabel}>Minimum received:</span>
            <StateCurrencyAmount
              amount={minimumReceived}
              isError={!minimumReceived && !loading}
              currency={outputToken ? getTokenSymbol(outputToken) : ''}
              balanceRule
            />
          </>
        )}
      </div>
    </>
  );
};
