import { FC, useContext, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { MAINNET_DEFAULT_TOKEN } from '@config/tokens';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useExchangeRates } from '@providers/use-new-exchange-rate';
import { QuipuToken } from '@shared/svg';

import styles from './qp-token.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface QPTokenProps {
  id?: string;
  className?: string;
}

const DEFAULT_PRECISION = 2;

export const QPToken: FC<QPTokenProps> = ({ id, className }) => {
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
    <div className={cx(styles.root, modeClass[colorThemeMode], className)}>
      <QuipuToken id={id} />
      <span className={styles.price}>$ {price.isNaN() ? '???' : price.toFixed(DEFAULT_PRECISION)}</span>
    </div>
  );
};
