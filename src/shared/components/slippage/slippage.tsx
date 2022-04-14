import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { DEFAULT_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { Scaffolding, SlippageInput, Tooltip } from '@shared/components';
import { Nullable, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

interface Props {
  title: string;
  tooltip: string;
  error: Undefined<string>;
  slippage: BigNumber;
  tooltipId: string;
  onChange: (newValue: BigNumber) => void;
}

export const Slippage: FC<Props> = ({ error, onChange, slippage, title, tooltip, tooltipId }) => {
  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_SLIPPAGE_PERCENTAGE));

  return (
    <div>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{title}</span>
        <Tooltip content={tooltip} testId={tooltipId} />
      </label>
      <SlippageInput handleChange={handleChange} value={slippage.toFixed()} />
      <Scaffolding height={27.5} showChild={Boolean(error)}>
        <div className={styles.simpleError}>{error}</div>
      </Scaffolding>
    </div>
  );
};
