import { FC, useContext } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { DEFAULT_TOKEN } from '@config/tokens';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount } from '@shared/components';
import { getTokenSymbol } from '@shared/helpers';
import { Optional } from '@shared/types';
import { i18n } from '@translation';

import styles from './creation-cost.module.scss';

export interface CreationCostProps {
  burned: Optional<BigNumber.Value>;
  devFee: Optional<BigNumber.Value>;
  total: Optional<BigNumber.Value>;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CreationCost: FC<CreationCostProps> = ({ burned, devFee, total }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], styles.cost)}>
      <div className={styles.costItem}>
        <div>{i18n.t('stableswap|burnedCost')}</div>
        <StateCurrencyAmount amount={burned} currency={getTokenSymbol(DEFAULT_TOKEN)} />
      </div>
      <div className={styles.costItem}>
        <div>{i18n.t('stableswap|devFeeCost')}</div>
        <StateCurrencyAmount amount={devFee} currency={getTokenSymbol(DEFAULT_TOKEN)} />
      </div>
      <div className={styles.costItem}>
        <div>{i18n.t('stableswap|totalCost')}</div>
        <StateCurrencyAmount amount={total} currency={getTokenSymbol(DEFAULT_TOKEN)} />
      </div>
    </div>
  );
};
