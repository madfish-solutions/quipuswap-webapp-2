import React, { FC } from 'react';

import { TransactionDeadline } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS } from '@app.config';
import s from '@styles/CommonContainer.module.sass';
import { Nullable } from '@utils/types';

interface DeadlineInputProps {
  error?: string;
  value?: BigNumber;
  onChange: (newValue: Nullable<BigNumber>) => void;
}

export const DeadlineInput: FC<DeadlineInputProps> = ({ error, onChange, value }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue: Nullable<string>) =>
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
