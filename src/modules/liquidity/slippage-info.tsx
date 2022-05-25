import { FC } from 'react';

import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import { DEFAULT_DECIMALS } from '@config/constants';
import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol } from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { Nullable, Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

import { increaseOrDecreaseBySlippage } from './liquidity-cards/helpers';

export enum LiquiditySlippageType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

interface Props {
  liquidityType: LiquiditySlippageType;
  tokenAInput: string;
  tokenBInput: string;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
}

const DEFAULT_INVESTED_VALUE = 0;

export const SlippageInfo: FC<Props> = observer(({ liquidityType, tokenAInput, tokenBInput, tokenA, tokenB }) => {
  const {
    settings: { liquiditySlippage }
  } = useSettingsStore();

  const tokenABN = new BigNumber(tokenAInput ? tokenAInput : DEFAULT_INVESTED_VALUE);
  const tokenBBN = new BigNumber(tokenBInput ? tokenBInput : DEFAULT_INVESTED_VALUE);

  const decimalsA = (tokenA && tokenA.metadata.decimals) ?? DEFAULT_DECIMALS;
  const decimalsB = (tokenB && tokenB.metadata.decimals) ?? DEFAULT_DECIMALS;

  const maxInvestedOrReceivedA = increaseOrDecreaseBySlippage(liquidityType, tokenABN, decimalsA, liquiditySlippage);
  const maxInvestedOrReceivedB = increaseOrDecreaseBySlippage(liquidityType, tokenBBN, decimalsB, liquiditySlippage);

  const investedOrReceivedText = liquidityType === LiquiditySlippageType.ADD ? 'invested' : 'received';
  const DEFAULT_STABLE_TOKEN = DEFAULT_TOKEN;

  return (
    <>
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
});
