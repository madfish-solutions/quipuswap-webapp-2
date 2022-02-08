import React, { FC } from 'react';

import { Nullable } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS, PRESET_AMOUNT_INPUT_DECIMALS, MINIMUM_PRESET_AMOUNT_INPUT_VALUE } from '@app.config';
import { NewPresetsAmountInput } from '@components/common/new-preset-amount';
import { Tooltip } from '@components/ui/components/tooltip';
import s from '@styles/CommonContainer.module.sass';
import { useDeadline } from '@utils/dapp/slippage-deadline';

interface Props {
  className?: string;
  error?: string;
}

const DEADLINE_UNIT = 'm';

export const LiquidityDeadline: FC<Props> = ({ error, className }) => {
  const { t } = useTranslation(['common']);

  const { deadline, setDeadline, deadlineActiveButton, setDeadlineActiveButton, deadlinePresets } = useDeadline();

  const handleChange = (newValue: Nullable<string>) => setDeadline(new BigNumber(newValue || DEFAULT_DEADLINE_MINS));

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
      <NewPresetsAmountInput
        className={className}
        decimals={PRESET_AMOUNT_INPUT_DECIMALS}
        value={deadline}
        handleChange={handleChange}
        min={MINIMUM_PRESET_AMOUNT_INPUT_VALUE}
        placeholder={deadline.toFixed()}
        presets={deadlinePresets}
        activeButton={deadlineActiveButton}
        setActiveButton={setDeadlineActiveButton}
        unit={DEADLINE_UNIT}
      />
      {error && <div className={s.simpleError}>{error}</div>}
    </>
  );
};
