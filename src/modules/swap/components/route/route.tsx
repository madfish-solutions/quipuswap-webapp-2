import React, { Fragment, useContext } from 'react';

import cx from 'classnames';

import { getPoolSlug } from '@modules/swap/helpers';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { isLastElementIndex } from '@shared/helpers';

import s from './route.module.scss';
import { DexPool } from '../../types';
import { PoolButton } from '../pool-button';

export interface RouteProps {
  route: DexPool[];
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Route: React.FC<RouteProps> = ({ route, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {route.map((pool, index) => (
        <Fragment key={getPoolSlug(pool)}>
          <PoolButton pool={pool} />
          {!isLastElementIndex(index, route) && <span className={s.divider}>...</span>}
        </Fragment>
      ))}
    </div>
  );
};
