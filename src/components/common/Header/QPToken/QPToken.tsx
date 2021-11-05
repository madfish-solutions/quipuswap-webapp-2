import React, { useContext } from 'react';
import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

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

  const price = new BigNumber(exchangeRates && exchangeRates.find
    ? exchangeRates
      .find((e:any) => e.tokenAddress === STABLE_TOKEN.contractAddress)?.exchangeRate
    : NaN);

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
