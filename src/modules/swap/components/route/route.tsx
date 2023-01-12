import React, { Fragment, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { getTokenSlug, isLastElementIndex } from '@shared/helpers';

import { DexPool } from '../../types';
import { PoolButton } from '../pool-button';
import s from './route.module.scss';

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
        <Fragment key={getTokenSlug({ contractAddress: pool.dexAddress, fa2TokenId: pool.dexId?.toNumber() })}>
          <PoolButton pool={pool} />
          {!isLastElementIndex(index, route) && <span className={s.divider}>...</span>}
        </Fragment>
      ))}
    </div>
  );
};
