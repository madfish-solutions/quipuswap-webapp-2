import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { DEFAULT_DEADLINE_MINS } from '@config/constants';
import { Nullable } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { DataTestAttribute } from '@tests/types';
import { useTranslation } from '@translation';

import { DeadlineInput } from '../deadline-input';
import { Scaffolding } from '../scaffolding';
import { Tooltip } from '../tooltip';

interface Props extends DataTestAttribute {
  error?: string;
  value?: BigNumber;
  onChange: (newValue: BigNumber) => void;
}

export const TransactionDeadline: FC<Props> = ({ error, onChange, value, testId }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) =>
    onChange(new BigNumber(newValue ? newValue : DEFAULT_DEADLINE_MINS));

  return (
    <div data-test-id={testId}>
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{t('common|Transaction deadline')}</span>
        <Tooltip
          content={t(
            'common|Set the transaction execution deadline. If reached before the transaction is executed, the transaction will be aborted.'
          )}
        />
      </label>
      <DeadlineInput handleChange={handleChange} placeholder={value?.toFixed()} />
      <Scaffolding height={24} showChild={Boolean(error)}>
        <div className={styles.simpleError}>{error}</div>
      </Scaffolding>
    </div>
  );
};
