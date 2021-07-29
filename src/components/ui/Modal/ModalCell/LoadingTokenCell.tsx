import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

// import { Bage } from '@components/ui/Bage';
import { Skeleton } from '@components/ui/Skeleton';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LoadingTokenCell: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.loading,
    s.listItem,
    s.splitRow,
  );

  return (
    <div
      className={compoundClassName}
    >
      <div className={s.joinRow}>
        <Skeleton type="logo" />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <Skeleton type="longText" />
          </div>
          <Skeleton type="text" />
        </div>
      </div>
    </div>
  );
};
