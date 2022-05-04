import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { DOLLAR, EPPROXIMATILY_EQUAL_SIGN } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { formatValueBalance, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { DashPlug } from '../../dash-plug';
import { StateWrapper, StateWrapperProps } from '../state-wrapper';
import styles from './state-dollar-equivalent.module.scss';

const USD_DECIMALS_AMOUNT = 2;

export interface StateDollarEquivalentProps extends Partial<StateWrapperProps> {
  dollarEquivalent: Nullable<BigNumber.Value>;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const APPROXIMATELY_EQUAL_DOLLAR = `${EPPROXIMATILY_EQUAL_SIGN} ${DOLLAR}`;

export const StateDollarEquivalent: FC<StateDollarEquivalentProps> = ({
  dollarEquivalent,
  isLoading,
  loaderFallback,
  isError,
  errorFallback,
  className
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapIsLoading = isLoading ?? !isExist(dollarEquivalent);
  const wrapLoaderFallback = loaderFallback ?? <DashPlug zoom={0.7} />;
  const wrapErrorFallback = errorFallback ?? <DashPlug zoom={0.7} animation={false} />;

  const formattedAmount = dollarEquivalent ? formatValueBalance(dollarEquivalent, USD_DECIMALS_AMOUNT) : null;

  const title = dollarEquivalent ? new BigNumber(dollarEquivalent).toFixed() : undefined;

  return (
    <span className={cx(styles.dollarEquivalent, modeClass[colorThemeMode], className)}>
      <span className={styles.nowrap}>{APPROXIMATELY_EQUAL_DOLLAR}</span>
      <span className={styles.dollarEquivalentInner} title={title}>
        <StateWrapper
          isLoading={wrapIsLoading}
          loaderFallback={wrapLoaderFallback}
          isError={isError}
          errorFallback={wrapErrorFallback}
        >
          {formattedAmount}
        </StateWrapper>
      </span>
    </span>
  );
};
