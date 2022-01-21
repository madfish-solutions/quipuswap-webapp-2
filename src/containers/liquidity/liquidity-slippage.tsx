import React, { FC } from 'react';

import { Slippage } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_SLIPPAGE_PERCENTAGE, networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { increaseOrDecreaseBySlippage } from './liquidity-cards/helpers';

export enum LiquiditySlippageType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

interface SlippageInputProps {
  liquidityType: LiquiditySlippageType;
  error?: string;
  tokenAInput: string;
  tokenBInput: string;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
  slippage: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

const DEFAULT_INVESTED_VALUE = 0;

export const LiquiditySlippage: FC<SlippageInputProps> = ({
  liquidityType,
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

  const maxInvestedOrReceivedA = increaseOrDecreaseBySlippage(liquidityType, tokenABN, slippage);
  const maxInvestedOrReceivedB = increaseOrDecreaseBySlippage(liquidityType, tokenBBN, slippage);

  const investedOrReceivedText = liquidityType === LiquiditySlippageType.ADD ? 'invested' : 'received';
  const DEFAULT_STABLE_TOKEN = networksDefaultTokens[NETWORK_ID];

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Slippage')}
      </label>
      <Slippage handleChange={handleChange} placeholder={slippage.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.amountWrapper}>
        <span className={s.receiveLabel}>Max {investedOrReceivedText} A:</span>
        <StateCurrencyAmount
          amount={maxInvestedOrReceivedA}
          amountDecimals={tokenA?.metadata.decimals}
          currency={getWhitelistedTokenSymbol(tokenA ?? TEZOS_TOKEN)}
        />
      </div>
      <div className={s.amountWrapper}>
        <span className={s.receiveLabel}>Max {investedOrReceivedText} B:</span>
        <StateCurrencyAmount
          amount={maxInvestedOrReceivedB}
          amountDecimals={tokenB?.metadata.decimals}
          currency={getWhitelistedTokenSymbol(tokenB ?? DEFAULT_STABLE_TOKEN)}
        />
      </div>
    </>
  );
};
