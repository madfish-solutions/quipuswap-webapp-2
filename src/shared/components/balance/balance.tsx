import { FC, useMemo } from 'react';

import { ColorModes } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StateWrapper } from '@shared/components/state-wrapper';
import { DashPlug } from '@shared/components/dash-plug';
import { isUndefined, isExist, isNull } from '@shared/helpers/type-checks';
import { formatBalance } from '@shared/helpers/format-balance';
import { Optional } from 'types/types';

import styles from './balance.module.scss';

export interface BalanceProps {
  balance: Optional<string>;
  colorMode: ColorModes;
  text?: string;
  unit?: string;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Balance: FC<BalanceProps> = ({ balance, colorMode, text, unit }) => {
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
      <div className={cx(themeClass[colorMode], styles.label2, styles.price)}>
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
