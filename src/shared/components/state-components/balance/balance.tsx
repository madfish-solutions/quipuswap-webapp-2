import { FC, useMemo } from 'react';

import cx from 'classnames';

import { ColorModes } from '@providers/color-theme-context';
import { DashPlug, StateWrapper } from '@shared/components';
import { formatBalance, isExist, isNull, isUndefined } from '@shared/helpers';
import { Optional } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './balance.module.scss';

export interface BalanceProps {
  balance: Optional<string>;
  colorMode: ColorModes;
  text?: string;
  testId?: string;
  unit?: string;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Balance: FC<BalanceProps> = ({ balance, colorMode, text, unit, testId }) => {
  const { t } = useTranslation();

  const formattedBalance = useMemo(() => {
    if (!isExist(balance)) {
      return null;
    }

    return formatBalance(balance);
  }, [balance]);

  const isLoading = isNull(balance);

  const isError = isUndefined(balance);

  return (
    <div className={styles.item2Line}>
      <div className={styles.caption}>{text ?? t('common|Balance')}:</div>
      <div className={cx(themeClass[colorMode], styles.label2, styles.price)} data-cy={testId}>
        <StateWrapper
          isLoading={isLoading}
          isError={isError}
          loaderFallback={<DashPlug />}
          errorFallback={<DashPlug animation={false} />}
        >
          {unit ? `${formattedBalance} ${unit}` : formattedBalance}
        </StateWrapper>
      </div>
    </div>
  );
};
