import { Fragment, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { HOURS_IN_DAY, MINUTES_IN_HOUR, MS_IN_SECOND, SECONDS_IN_MINUTE } from '@app.config';

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

  const totalMins = new BigNumber(value).dividedToIntegerBy(SECONDS_IN_MINUTE * MS_IN_SECOND);
  const mins = totalMins.modulo(MINUTES_IN_HOUR);
  const hours = totalMins.dividedToIntegerBy(MINUTES_IN_HOUR).modulo(HOURS_IN_DAY);
  const days = totalMins.dividedToIntegerBy(MINUTES_IN_HOUR * HOURS_IN_DAY);

  const viewParts = [
    { periodName: t('common|dayLetter'), amount: days.toNumber() },
    { periodName: t('common|hourLetter'), amount: hours.toNumber() },
    { periodName: t('common|minuteLetter'), amount: mins.toNumber() }
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
