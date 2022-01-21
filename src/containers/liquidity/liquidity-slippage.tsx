import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import {
  DEFAULT_SLIPPAGE_PERCENTAGE,
  HANGZHOUNET_DEFAULT_TOKEN,
  MAINNET_DEFAULT_TOKEN,
  TEZOS_TOKEN
} from '@app.config';
import { NewPresetsAmountInput } from '@components/common/new-preset-amount';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { useNetwork } from '@utils/dapp';
import { useSlippage } from '@utils/dapp/slippage-deadline';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { increaseOrDecreaseBySlippage } from './liquidity-cards/helpers';

export enum LiquiditySlippageType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

interface SlippageInputProps {
  className?: string;
  liquidityType: LiquiditySlippageType;
  error?: string;
  tokenAInput: string;
  tokenBInput: string;
  tokenA: Nullable<WhitelistedToken>;
  tokenB: Nullable<WhitelistedToken>;
}

const DEFAULT_INVESTED_VALUE = 0;

export const LiquiditySlippage: FC<SlippageInputProps> = ({
  className,
  liquidityType,
  error,
  tokenAInput,
  tokenBInput,
  tokenA,
  tokenB
}) => {
  const { t } = useTranslation(['common']);

  const network = useNetwork().id;
  const { slippage, setSlippage, slippageActiveButton, setSlippageActiveButton, slippagePresets } = useSlippage();

  const handleChange = (newValue: Nullable<string>) => {
    setSlippage(newValue ? new BigNumber(newValue) : new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));
  };

  const tokenABN = new BigNumber(tokenAInput ? tokenAInput : DEFAULT_INVESTED_VALUE);
  const tokenBBN = new BigNumber(tokenBInput ? tokenBInput : DEFAULT_INVESTED_VALUE);

  const maxInvestedOrReceivedA = increaseOrDecreaseBySlippage(liquidityType, tokenABN, slippage);
  const maxInvestedOrReceivedB = increaseOrDecreaseBySlippage(liquidityType, tokenBBN, slippage);

  const investedOrReceivedText = liquidityType === LiquiditySlippageType.ADD ? 'invested' : 'received';
  const DEFAULT_STABLE_TOKEN = network === 'mainnet' ? MAINNET_DEFAULT_TOKEN : HANGZHOUNET_DEFAULT_TOKEN;

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Slippage')}
      </label>
      <NewPresetsAmountInput
        className={className}
        decimals={2}
        value={slippage}
        handleChange={handleChange}
        min={0}
        placeholder={slippage.toFixed()}
        presets={slippagePresets}
        activeButton={slippageActiveButton}
        setActiveButton={setSlippageActiveButton}
        unit="%"
      />
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
