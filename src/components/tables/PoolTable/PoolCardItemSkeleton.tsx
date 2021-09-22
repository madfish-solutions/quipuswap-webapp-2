import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Skeleton } from '@components/ui/Skeleton';

import s from './PoolCardTable.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolCardItemSkeleton: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <Skeleton className={cx(s.skeleton, s.cardCellItem, s.tokenLogoBlock)} />
      <Skeleton className={cx(s.skeleton, s.textItem, s.cardCellItem)} />
      <Skeleton className={cx(s.skeleton, s.textItem, s.cardCellItem)} />
      <Skeleton className={cx(s.skeleton, s.links, s.cardCellItem, s.buttons)} />
    </div>
  );
};
