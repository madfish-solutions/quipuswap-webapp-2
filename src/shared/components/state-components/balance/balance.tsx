import { FC } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ColorModes } from '@providers/color-theme-context';
import { DashPlug, StateCurrencyAmount } from '@shared/components';
import { isNull, isUndefined } from '@shared/helpers';
import { Optional } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './balance.module.scss';

export interface BalanceProps {
  balance: Optional<BigNumber.Value>;
  colorMode: ColorModes;
  text?: string;
  unit?: string;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Balance: FC<BalanceProps> = ({ balance, colorMode, text, unit }) => {
  const { t } = useTranslation();

  const isLoading = isNull(balance);

  const isError = isUndefined(balance);

  return (
    <div className={styles.item2Line}>
      <div className={styles.caption} data-test-id="titleBalance">
        {text ?? t('common|Balance')}:
      </div>
      <div className={cx(themeClass[colorMode], styles.label2, styles.price)}>
        <StateCurrencyAmount
          isLoading={isLoading}
          isError={isError}
          loaderFallback={<DashPlug />}
          errorFallback={<DashPlug animation={false} />}
          testId="balance"
          amount={balance}
          currency={unit}
        />
      </div>
    </div>
  );
};
