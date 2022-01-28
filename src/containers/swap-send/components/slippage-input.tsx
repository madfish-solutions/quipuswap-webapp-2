import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import { Slippage } from '@components/common/Slippage';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { fromDecimals, getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  loading: boolean;
  outputAmount?: BigNumber;
  outputToken?: WhitelistedToken;
  slippage?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

const WHOLE_ITEM_PERCENT = 100;
const EMPTY_OUTPUT_AMOUNT = 0;

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

  const tokenDecimals = outputToken?.metadata.decimals ?? 0;

  const minimumReceived =
    slippage && outputAmount?.gt(EMPTY_OUTPUT_AMOUNT)
      ? BigNumber.maximum(
          outputAmount
            .times(new BigNumber(1).minus(slippage.div(WHOLE_ITEM_PERCENT)))
            .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR),
          fromDecimals(new BigNumber(1), tokenDecimals)
        )
      : null;

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
              currency={outputToken ? getWhitelistedTokenSymbol(outputToken) : ''}
              balanceRule
            />
          </>
        )}
      </div>
    </>
  );
};
