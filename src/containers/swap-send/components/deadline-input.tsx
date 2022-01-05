import React, { FC } from 'react';

import { TransactionDeadline } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { DEFAULT_DEADLINE_MINS } from '@app.config';
import { appi18n } from '@app.i18n';
import s from '@styles/CommonContainer.module.sass';

interface DeadlineInputProps {
  error?: string;
  value?: BigNumber;
  onChange: (newValue?: BigNumber) => void;
}

export const DeadlineInput: FC<DeadlineInputProps> = ({ error, onChange, value }) => {
  const { t } = appi18n;

  const handleChange = (newValue?: string) =>
    onChange(newValue ? new BigNumber(newValue) : new BigNumber(DEFAULT_DEADLINE_MINS));

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Transaction deadline')}
      </label>
      <TransactionDeadline handleChange={handleChange} placeholder={value?.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
    </>
  );
};
