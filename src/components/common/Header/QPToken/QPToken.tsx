import React, { useContext } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { STABLE_TOKEN } from '@utils/defaults';
import Token from '@icons/Token.svg';

import s from './QPToken.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type QPTokenProps = {
  className?: string
};

export const QPToken: React.FC<QPTokenProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const exchangeRates = useExchangeRates();

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <Token />
      <span className={s.price}>
        $
        {' '}
        {new BigNumber(exchangeRates
          ? exchangeRates
            .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)
            .exchangeRate
          : 5.34).toFixed(2) ?? '5.34'}
      </span>
    </div>
  );
};
