import { Fragment, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { FIRST_TWO_DIGITS_NUMBER } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DashPlug } from '@shared/components';
import { parseTimelock } from '@shared/helpers';
import { Undefined } from '@shared/types';
import { useTranslation } from '@translation';

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
  const { days, hours, minutes } = parseTimelock(value);

  const viewParts = [
    { periodName: t('common|dayLetter'), amount: days },
    { periodName: t('common|hourLetter'), amount: hours },
    { periodName: t('common|minuteLetter'), amount: minutes }
  ];

  return (
    <span className={cx(styles.root, modeClass[colorThemeMode], className)} data-test-id="timespanView">
      {viewParts.map(({ periodName, amount }) => (
        <Fragment key={periodName}>
          <span className={cx(styles.amountName, amountClassName)}>{formatValue(amount, shouldShow)}</span>
          <span className={cx(styles.periodName, periodClassName)}>{periodName}</span>
        </Fragment>
      ))}
    </span>
  );
};
