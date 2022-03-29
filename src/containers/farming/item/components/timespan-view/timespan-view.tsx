import { Fragment, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { parseTimelock } from '@utils/helpers';

import styles from './timespan-view.module.sass';

export interface TimespanViewProps {
  amountClassName?: string;
  className?: string;
  periodClassName?: string;
  /**
   * Timespan duration in ms
   */
  value: BigNumber.Value;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TimespanView = ({ amountClassName, className, periodClassName, value }: TimespanViewProps) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { days, hours, minutes } = parseTimelock(value);

  const viewParts = [
    { periodName: t('common|dayLetter'), amount: days },
    { periodName: t('common|hourLetter'), amount: hours },
    { periodName: t('common|minuteLetter'), amount: minutes }
  ].filter(({ amount }) => amount > 0);

  return (
    <span className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {viewParts.length > 0
        ? viewParts.map(({ periodName, amount }) => (
            <Fragment key={periodName}>
              <span className={cx(styles.amountName, amountClassName)}>{amount}</span>
              <span className={cx(styles.periodName, periodClassName)}>{periodName}</span>
            </Fragment>
          ))
        : '-'}
    </span>
  );
};
