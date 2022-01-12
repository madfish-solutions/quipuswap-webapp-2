import React, { FC } from 'react';

import { Slippage } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import { CurrencyAmount } from '@components/common/currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  outputAmount?: BigNumber;
  outputToken?: WhitelistedToken;
  slippage?: BigNumber;
  onChange: (newValue?: BigNumber) => void;
}

const WHOLE_ITEM_PERCENT = 100;

export const SlippageInput: FC<SlippageInputProps> = ({ error, outputAmount, onChange, slippage, outputToken }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue?: string) =>
    onChange(newValue ? new BigNumber(newValue) : new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));

  const tokenDecimals = outputToken?.metadata.decimals ?? 0;

  const minimumReceived =
    slippage && outputAmount
      ? outputAmount
          .times(new BigNumber(1).minus(slippage.div(WHOLE_ITEM_PERCENT)))
          .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR)
      : new BigNumber(0);

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
            <CurrencyAmount
              amount={minimumReceived.toFixed()}
              currency={outputToken ? getWhitelistedTokenSymbol(outputToken) : ''}
            />
          </>
        )}
      </div>
    </>
  );
};
