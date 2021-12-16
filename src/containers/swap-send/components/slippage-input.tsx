import React, { FC } from 'react';

import { Slippage, CurrencyAmount } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import s from '@styles/CommonContainer.module.sass';
import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

interface SlippageInputProps {
  error?: string;
  outputAmount?: BigNumber;
  outputToken?: WhitelistedToken;
  onChange: (newValue?: BigNumber) => void;
  slippage?: BigNumber;
}

const WHOLE_ITEM_PERCENT = 100;

export const SlippageInput: FC<SlippageInputProps> = ({ error, outputAmount, onChange, slippage, outputToken }) => {
  const handleChange = (newValue?: string) => {
    if (!newValue) {
      onChange(new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));
    } else {
      const parsedPercentage = new BigNumber(newValue);
      onChange(parsedPercentage.isFinite() ? parsedPercentage : undefined);
    }
  };

  const tokenDecimals = outputToken?.metadata.decimals ?? 0;

  const minimumReceived =
    slippage && outputAmount
      ? outputAmount
          .times(new BigNumber(1).minus(slippage.div(WHOLE_ITEM_PERCENT)))
          .decimalPlaces(tokenDecimals, BigNumber.ROUND_FLOOR)
      : new BigNumber(0);

  return (
    <>
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
