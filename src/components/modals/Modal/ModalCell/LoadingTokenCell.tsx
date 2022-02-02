import React, { useContext } from 'react';

import cx from 'classnames';

import { Skeleton } from '@components/common/Skeleton';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const LoadingTokenCell: React.FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(modeClass[colorThemeMode], s.loading, s.listItem, s.splitRow);

  return (
    <div className={compoundClassName}>
      <div className={s.joinRow}>
        <Skeleton className={s.loadingLogo} />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <Skeleton className={s.loadingSymbol} />
            <Skeleton className={s.loadingBage} />
          </div>
          <Skeleton className={s.loadingName} />
        </div>
      </div>
    </div>
  );
};
