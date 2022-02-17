import React, { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS } from '@app.config';
import { TransactionDeadline } from '@components/common/TransactionDeadline';
import { Tooltip } from '@components/ui/components/tooltip';
import s from '@styles/CommonContainer.module.sass';
import { Nullable } from '@utils/types';

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
      <label htmlFor="deadline" className={s.inputLabel}>
        <span>{t('common|Transaction deadline')}</span>
        <Tooltip
          content={t(
            'common|Set the transaction execution deadline. If reached before the transaction is executed, the transaction will be aborted.'
          )}
        />
      </label>
      <TransactionDeadline handleChange={handleChange} placeholder={value?.toFixed()} />
      {error && <div className={s.simpleError}>{error}</div>}
    </>
  );
};
