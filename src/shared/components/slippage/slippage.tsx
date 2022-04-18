import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DEFAULT_LIQUIDITY_SLIPPAGE_PERCENTAGE, DEFAULT_TRADING_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { Scaffolding, SlippageInput, SlippageType, Tooltip } from '@shared/components';
import { Nullable, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { DataTestAttribute } from '@tests/types';

interface Props extends DataTestAttribute {
  title: string;
  tooltip: string;
  error: Undefined<string>;
  slippage: BigNumber;
  type: SlippageType;
  onChange: (newValue: BigNumber) => void;
}

const defaultSlippagePercentage = {
  [SlippageType.LIQUIDITY]: DEFAULT_LIQUIDITY_SLIPPAGE_PERCENTAGE,
  [SlippageType.TRADING]: DEFAULT_TRADING_SLIPPAGE_PERCENTAGE
};

export const Slippage: FC<Props> = ({ error, onChange, slippage, title, tooltip, type, testId }) => {
  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ?? defaultSlippagePercentage[type]));

  return (
    <div data-test-id={testId}>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{title}</span>
        <Tooltip content={tooltip} />
      </label>
      <SlippageInput type={type} handleChange={handleChange} value={slippage.toFixed()} />
      <Scaffolding height={27.5} showChild={Boolean(error)}>
        <div className={styles.simpleError}>{error}</div>
      </Scaffolding>
    </div>
  );
};
