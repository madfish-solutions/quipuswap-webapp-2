import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Skeleton } from '@components/ui/Skeleton';

import s from './PoolTable.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolItemSkeleton: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    s.tableRow,
    s.farmRow,
    s.tableHeader,
    modeClass[colorThemeMode],
    s.tableHeaderBorder,
  );
  return (
    <tr>
      <td className={compoundClassName}>
        <Skeleton className={
          cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText, s.skeleton)
          }
        />
        <Skeleton className={cx(s.cardCellItem, s.skeleton)} />
        <Skeleton className={cx(s.cardCellItem, s.skeleton)} />
        <Skeleton className={cx(s.links, s.cardCellItem, s.skeleton)} />
      </td>
    </tr>
  );
};
