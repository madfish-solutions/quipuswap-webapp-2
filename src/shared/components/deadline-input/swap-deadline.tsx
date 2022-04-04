import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_DEADLINE_MINS } from '@config/constants';
import { Nullable } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Tooltip } from '../tooltip';
import { TransactionDeadline } from '../transaction-deadline';

interface Props {
  error?: string;
  value?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

export const SwapDeadline: FC<Props> = ({ error, onChange, value }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_DEADLINE_MINS));

  return (
    <>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{t('common|Transaction deadline')}</span>
        <Tooltip
          content={t(
            'common|Set the transaction execution deadline. If reached before the transaction is executed, the transaction will be aborted.'
          )}
        />
      </label>
      <TransactionDeadline handleChange={handleChange} placeholder={value?.toFixed()} />
      {error && <div className={styles.simpleError}>{error}</div>}
    </>
  );
};
