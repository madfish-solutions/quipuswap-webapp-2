import { FC, useMemo } from 'react';

import { ColorModes } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { StateWrapper } from '@components/state-wrapper';
import { DashPlug } from '@components/ui/dash-plug';
import { formatBalance, isExist } from '@utils/helpers';
import { Nullable, Undefined } from '@utils/types';

import styles from './balance.module.scss';

export interface BalanceProps {
  balance: Undefined<Nullable<string>>;
  colorMode: ColorModes;
  text?: string;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Balance: FC<BalanceProps> = ({ balance, colorMode, text }) => {
  const { t } = useTranslation();

  const formattedBalance = useMemo(() => {
    if (!isExist(balance)) {
      return null;
    }

    return formatBalance(balance);
  }, [balance]);

  const isError = !Boolean(formattedBalance);

  return (
    <div className={styles.item2Line}>
      <div className={styles.caption}>{text ?? t('common|Balance')}:</div>
      <div className={cx(themeClass[colorMode], styles.label2, styles.price)}>
        <StateWrapper
          isLoading={!formattedBalance}
          isError={isError}
          loaderFallback={<DashPlug />}
          errorFallback={<DashPlug animation={false} />}
        >
          {formattedBalance}
        </StateWrapper>
      </div>
    </div>
  );
};
