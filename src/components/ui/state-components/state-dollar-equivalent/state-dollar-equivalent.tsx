import React, { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { StateWrapper, StateWrapperProps } from '@components/state-wrapper';
import { Nullable } from '@interfaces/types';
import { FormatNumber } from '@utils/formatNumber';
import { isExist } from '@utils/helpers';

import { DashPlug } from '../../dash-plug';
import s from './state-dollar-equivalent.module.sass';

export interface StateDollarEquivalentProps extends Partial<StateWrapperProps> {
  dollarEquivalent: Nullable<BigNumber.Value>;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const StateDollarEquivalent: FC<StateDollarEquivalentProps> = ({
  dollarEquivalent,
  isLoading,
  loaderFallback,
  isError,
  errorFallback
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapIsLoading = isLoading ?? !isExist(dollarEquivalent);
  const wrapLoaderFallback = loaderFallback ?? <DashPlug zoom={0.7} />;
  const wrapErrorFallback = errorFallback ?? <DashPlug zoom={0.7} animation={false} />;

  return (
    <span className={cx(s.dollarEquivalent, modeClass[colorThemeMode])}>
      ≈ ${' '}
      <span className={s.dollarEquivalentInner}>
        <StateWrapper
          isLoading={wrapIsLoading}
          loaderFallback={wrapLoaderFallback}
          isError={isError}
          errorFallback={wrapErrorFallback}
        >
          {FormatNumber(dollarEquivalent ?? 0, { decimals: 2 })}
        </StateWrapper>
      </span>
    </span>
  );
};
