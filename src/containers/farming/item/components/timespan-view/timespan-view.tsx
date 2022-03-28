import { Fragment, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { HOURS_IN_DAY, MINUTES_IN_HOUR, MS_IN_SECOND, SECONDS_IN_MINUTE } from '@app.config';
import { DashPlug } from '@components/ui/dash-plug';
import { Undefined } from '@utils/types';

import styles from './timespan-view.module.scss';

export interface TimespanViewProps {
  amountClassName?: string;
  className?: string;
  periodClassName?: string;
  shouldShow?: boolean;
  /**
   * Timespan duration in ms
   */
  value: BigNumber.Value;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};
const FIRST_TWO_DIGITS_NUMBER = 10;
const DASH_QUANTITY = 2;

const formatValue = (time: number, shouldShow: Undefined<boolean>) => {
  if (shouldShow) {
    return time < FIRST_TWO_DIGITS_NUMBER ? `0${time}` : `${time}`;
  } else {
    return <DashPlug animation={false} quantity={DASH_QUANTITY} />;
  }
};

export const TimespanView = ({
  amountClassName,
  className,
  periodClassName,
  shouldShow = true,
  value
}: TimespanViewProps) => {
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
  ];

  return (
    <span className={cx(styles.root, modeClass[colorThemeMode], className)}>
      {viewParts.map(({ periodName, amount }) => (
        <Fragment key={periodName}>
          <span className={cx(styles.amountName, amountClassName)}>{formatValue(amount, shouldShow)}</span>
          <span className={cx(styles.periodName, periodClassName)}>{periodName}</span>
        </Fragment>
      ))}
    </span>
  );
};
