import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { Slippage as SlippageInner, Tooltip } from '@shared/components';
import { Nullable, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

interface Props {
  title: string;
  tooltip: string;
  error: Undefined<string>;
  slippage: Undefined<BigNumber>;
  onChange: (newValue: BigNumber) => void;
}

export const Slippage: FC<Props> = ({ error, onChange, slippage, title, tooltip }) => {
  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_SLIPPAGE_PERCENTAGE));

  return (
    <>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{title}</span>
        <Tooltip content={tooltip} />
      </label>
      <SlippageInner handleChange={handleChange} placeholder={slippage?.toFixed()} />
      {error && <div className={styles.simpleError}>{error}</div>}
    </>
  );
};
