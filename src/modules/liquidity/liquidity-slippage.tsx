import { FC } from 'react';

import BigNumber from 'bignumber.js';

import {
  DEFAULT_SLIPPAGE_PERCENTAGE,
  MINIMUM_PRESET_AMOUNT_INPUT_VALUE,
  NETWORK_ID,
  networksDefaultTokens,
  PRESET_AMOUNT_INPUT_DECIMALS,
  TEZOS_TOKEN
} from '@config/config';
import { Tooltip, StateCurrencyAmount, NewPresetsAmountInput } from '@shared/components';
import { useSlippage } from '@shared/dapp';
import { getTokenSymbol } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

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
      <label htmlFor="deadline" className={styles.inputLabel}>
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
      {error && <div className={styles.simpleError}>{error}</div>}
      <div className={styles.amountWrapper}>
        <span className={styles.receiveLabel}>Max {investedOrReceivedText} A:</span>
        <StateCurrencyAmount
          amount={maxInvestedOrReceivedA}
          amountDecimals={tokenA?.metadata.decimals}
          currency={getTokenSymbol(tokenA ?? TEZOS_TOKEN)}
        />
      </div>
      <div className={styles.amountWrapper}>
        <span className={styles.receiveLabel}>Max {investedOrReceivedText} B:</span>
        <StateCurrencyAmount
          amount={maxInvestedOrReceivedB}
          amountDecimals={tokenB?.metadata.decimals}
          currency={getTokenSymbol(tokenB ?? DEFAULT_STABLE_TOKEN)}
        />
      </div>
    </>
  );
};
