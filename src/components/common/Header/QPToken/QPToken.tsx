import React, { useContext, useMemo } from 'react';

import { ColorModes, ColorThemeContext, QuipuToken } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { MAINNET_DEFAULT_TOKEN } from '@app.config';
import { useExchangeRates } from '@hooks/useExchangeRate';

import s from './QPToken.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface QPTokenProps {
  id?: string;
  className?: string;
}

export const QPToken: React.FC<QPTokenProps> = ({ id, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const exchangeRates = useExchangeRates();

  const price = useMemo(() => {
    if (!exchangeRates) {
      return new BigNumber(NaN);
    }
    const rawExchangeRate = exchangeRates.find(
      ({ tokenAddress }) => tokenAddress === MAINNET_DEFAULT_TOKEN.contractAddress
    )?.exchangeRate;

    return new BigNumber(rawExchangeRate || NaN);
  }, [exchangeRates]);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <QuipuToken id={id} />
      <span className={s.price}>$ {price.isNaN() ? '???' : price.toFixed(2)}</span>
    </div>
  );
};
