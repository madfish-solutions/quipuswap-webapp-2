import { FC } from 'react';

import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { DEFAULT_DEADLINE_MINS, PRESET_AMOUNT_INPUT_DECIMALS, MINIMUM_PRESET_AMOUNT_INPUT_VALUE } from '@config/config';
import { PresetsAmountInput, Tooltip } from '@shared/components';
import { useDeadline } from '@shared/dapp';
import { Nullable } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

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
      <label htmlFor="deadline" className={styles.inputLabel}>
        <span>{t('common|Transaction deadline')}</span>
        <Tooltip
          content={t(
            'common|Set the transaction execution deadline. If reached before the transaction is executed, the transaction will be aborted.'
          )}
        />
      </label>
      <PresetsAmountInput
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
      {error && <div className={styles.simpleError}>{error}</div>}
    </>
  );
};
