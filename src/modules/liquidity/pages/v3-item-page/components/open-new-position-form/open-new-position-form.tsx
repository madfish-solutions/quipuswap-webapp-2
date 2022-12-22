import { FC } from 'react';

import {
  Button,
  ConnectWalletOrDoSomething,
  Iterator,
  SwitcherLabel,
  TokenInput,
  TokenInputProps,
  Tooltip
} from '@shared/components';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './open-new-position-form.module.scss';

interface OpenNewPositionFormProps {
  amountInputsProps: TokenInputProps[];
  rangeInputsProps: TokenInputProps[];
  onSubmit: () => void;
  disabled: boolean;
  loading: boolean;
  isFullRangePosition: boolean;
  onFullRangeSwitcherClick: (newState: boolean) => void;
}

export const OpenNewPositionForm: FC<OpenNewPositionFormProps> = ({
  amountInputsProps,
  rangeInputsProps,
  onSubmit,
  disabled,
  loading,
  isFullRangePosition,
  onFullRangeSwitcherClick
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.rangeInputsGroup}>
        <Iterator render={TokenInput} data={rangeInputsProps} />
      </div>

      <div className={styles.switcherRow}>
        <SwitcherLabel
          value={isFullRangePosition}
          onClick={onFullRangeSwitcherClick}
          switcherDTI="fullRangePositionSwitcher"
          switcherTranslationDTI="fullRangePositionSwitcher"
          translation={t('liquidity|createFullRangePosition')}
          translationClassName={styles.switcherTranslation}
          className={styles.switcherContainer}
        />
        <Tooltip content={t('liquidity|fullRangePositionTooltip')} className={styles.tooltip} />
      </div>

      <Iterator render={TokenInput} data={amountInputsProps} separator={<Plus className={styles.svg} />} />

      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={disabled}
            loading={loading}
            data-test-id="dexTwoCreatePoolButton"
          >
            {t('common|Create')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
