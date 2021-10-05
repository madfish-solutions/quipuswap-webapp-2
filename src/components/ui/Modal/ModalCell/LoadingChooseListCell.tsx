import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Skeleton } from '@components/ui/Skeleton';
import { Switcher } from '@components/ui/Switcher';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LoadingChooseListCell: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.loading,
    s.listItem,
    s.splitRow,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.joinRow}>
        <Skeleton className={s.loadingLogo} />
        <div className={s.mleft8}>
          <Skeleton className={s.loadingName} />
          <Skeleton className={s.loadingCount} />
        </div>
      </div>

      <Switcher
        isActive={false}
        onChange={() => {}}
      />
    </div>
  );
};
