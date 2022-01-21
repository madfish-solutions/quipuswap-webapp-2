import React, { FC } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS } from '@app.config';
import { NewPresetsAmountInput } from '@components/common/new-preset-amount';
import s from '@styles/CommonContainer.module.sass';
import { useDeadline } from '@utils/dapp/slippage-deadline';

interface DeadlineInputProps {
  className?: string;
  error?: string;
  placeholder?: string;
}

export const LiquidityDeadline: FC<DeadlineInputProps> = ({ error, className, placeholder }) => {
  const { t } = useTranslation(['common']);

  const { deadline, setDeadline, deadlineActiveButton, setDeadlineActiveButton, deadlinePresets } = useDeadline();

  const handleChange = (newValue: Nullable<string>) =>
    setDeadline(new BigNumber(newValue ? newValue : DEFAULT_DEADLINE_MINS));

  return (
    <>
      <label htmlFor="deadline" className={s.inputLabel}>
        {t('common|Transaction deadline')}
      </label>
      <NewPresetsAmountInput
        className={className}
        decimals={2}
        value={deadline}
        handleChange={handleChange}
        min={0}
        placeholder={deadline.toFixed()}
        presets={deadlinePresets}
        activeButton={deadlineActiveButton}
        setActiveButton={setDeadlineActiveButton}
        unit="m"
      />
      {error && <div className={s.simpleError}>{error}</div>}
    </>
  );
};
