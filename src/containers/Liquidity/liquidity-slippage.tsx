import React, { FC } from 'react';

import { Slippage, CurrencyAmount } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@app.config';
import { decreaseBySlippage, increaseBySlippage } from '@containers/Liquidity/LiquidityForms/helpers';
import s from '@styles/CommonContainer.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

export enum LiquiditySlippageType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

interface SlippageInputProps {
  type: LiquiditySlippageType;
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
  type,
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

  const maxInvestedOrReceivedA =
    type === LiquiditySlippageType.ADD
      ? increaseBySlippage(tokenABN, slippage)
      : decreaseBySlippage(tokenABN, slippage);
  const maxInvestedOrReceivedB =
    type === LiquiditySlippageType.ADD
      ? increaseBySlippage(tokenBBN, slippage)
      : decreaseBySlippage(tokenBBN, slippage);

  const investedOrReceivedText = type === LiquiditySlippageType.ADD ? 'invested' : 'received';

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Slippage')}
      </label>
      <Slippage handleChange={handleChange} placeholder={slippage.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.receive}>
        <div>
          <span className={s.receiveLabel}>Max {investedOrReceivedText} A:</span>
          <CurrencyAmount amount={maxInvestedOrReceivedA.toFixed()} currency={getWhitelistedTokenSymbol(tokenA)} />
        </div>
        <div>
          <span className={s.receiveLabel}>Max {investedOrReceivedText} B:</span>
          <CurrencyAmount amount={maxInvestedOrReceivedB.toFixed()} currency={getWhitelistedTokenSymbol(tokenB)} />
        </div>
      </div>
    </>
  );
};
