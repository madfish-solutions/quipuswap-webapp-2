import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import {
  DEFAULT_SLIPPAGE_PERCENTAGE,
  MINIMUM_PRESET_AMOUNT_INPUT_VALUE,
  NETWORK_ID,
  networksDefaultTokens,
  PRESET_AMOUNT_INPUT_DECIMALS,
  TEZOS_TOKEN
} from '@app.config';
import { NewPresetsAmountInput } from '@components/common/new-preset-amount';
import { Tooltip } from '@components/ui/components/tooltip';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import s from '@styles/CommonContainer.module.sass';
import { useSlippage } from '@utils/dapp/slippage-deadline';
import { getTokenSymbol } from '@utils/helpers';
import { Nullable, Token } from '@utils/types';

import { increaseOrDecreaseBySlippage } from './liquidity-cards/helpers';

export enum LiquiditySlippageType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

interface Props {
  className?: string;
  liquidityType: LiquiditySlippageType;
  error?: string;
  tokenAInput: string;
  tokenBInput: string;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
}

const DEFAULT_INVESTED_VALUE = 0;
const SLIPPAGE_UNIT = '%';

export const LiquiditySlippage: FC<Props> = ({
  className,
  liquidityType,
  error,
  tokenAInput,
  tokenBInput,
  tokenA,
  tokenB
}) => {
  const { t } = useTranslation(['common']);

  const { slippage, setSlippage, slippageActiveButton, setSlippageActiveButton, slippagePresets } = useSlippage();

  const handleChange = (newValue: Nullable<string>) =>
    setSlippage(new BigNumber(newValue || DEFAULT_SLIPPAGE_PERCENTAGE));

  const tokenABN = new BigNumber(tokenAInput ? tokenAInput : DEFAULT_INVESTED_VALUE);
  const tokenBBN = new BigNumber(tokenBInput ? tokenBInput : DEFAULT_INVESTED_VALUE);

  const maxInvestedOrReceivedA = increaseOrDecreaseBySlippage(liquidityType, tokenABN, slippage);
  const maxInvestedOrReceivedB = increaseOrDecreaseBySlippage(liquidityType, tokenBBN, slippage);

  const investedOrReceivedText = liquidityType === LiquiditySlippageType.ADD ? 'invested' : 'received';
  const DEFAULT_STABLE_TOKEN = networksDefaultTokens[NETWORK_ID];

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        <span>{t('common|Slippage')}</span>
        <Tooltip
          content={t(
            'common|Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through.'
          )}
        />
      </label>
      <NewPresetsAmountInput
        className={className}
        decimals={PRESET_AMOUNT_INPUT_DECIMALS}
        value={slippage}
        handleChange={handleChange}
        min={MINIMUM_PRESET_AMOUNT_INPUT_VALUE}
        placeholder={slippage.toFixed()}
        presets={slippagePresets}
        activeButton={slippageActiveButton}
        setActiveButton={setSlippageActiveButton}
        unit={SLIPPAGE_UNIT}
      />
      {error && <div className={s.simpleError}>{error}</div>}
      <div className={s.amountWrapper}>
        <span className={s.receiveLabel}>Max {investedOrReceivedText} A:</span>
        <StateCurrencyAmount
          balanceRule
          amount={maxInvestedOrReceivedA}
          amountDecimals={tokenA?.metadata.decimals}
          currency={getTokenSymbol(tokenA ?? TEZOS_TOKEN)}
        />
      </div>
      <div className={s.amountWrapper}>
        <span className={s.receiveLabel}>Max {investedOrReceivedText} B:</span>
        <StateCurrencyAmount
          balanceRule
          amount={maxInvestedOrReceivedB}
          amountDecimals={tokenB?.metadata.decimals}
          currency={getTokenSymbol(tokenB ?? DEFAULT_STABLE_TOKEN)}
        />
      </div>
    </>
  );
};
