import React, { FC } from 'react';

import { TransactionDeadline } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import s from '@styles/CommonContainer.module.sass';
import { DEFAULT_DEADLINE_MINS } from '@utils/defaults';

interface DeadlineInputProps {
  error?: string;
  value?: BigNumber;
  onChange: (newValue?: BigNumber) => void;
}

export const DeadlineInput: FC<DeadlineInputProps> = ({ error, onChange, value }) => {
  const { t } = useTranslation(['common']);

  const handleChange = (newValue?: string) => {
    if (!newValue) {
      onChange(new BigNumber(DEFAULT_DEADLINE_MINS));
    } else {
      const parsedValue = new BigNumber(newValue);
      onChange(parsedValue.isFinite() ? parsedValue : undefined);
    }
  };

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
