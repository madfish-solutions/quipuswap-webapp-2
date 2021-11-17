import React, { useContext, useMemo } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { STABLE_TOKEN } from '@utils/defaults';
import { QuipuToken } from '@components/svg/QuipuToken';

import s from './QPToken.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type QPTokenProps = {
  id?: string
  className?: string
};

export const QPToken: React.FC<QPTokenProps> = ({
  id,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const exchangeRates = useExchangeRates();

  const price = useMemo(() => {
    if (!exchangeRates) {
      return new BigNumber(NaN);
    }
    const rawExchangeRate = exchangeRates
      .find(({ tokenAddress }) => tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate;
    return new BigNumber(rawExchangeRate || NaN);
  }, [exchangeRates]);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <QuipuToken id={id} />
      <span className={s.price}>
        $
        {' '}
        {price.isNaN() ? '???' : price.toFixed(2)}
      </span>
    </div>
  );
};
