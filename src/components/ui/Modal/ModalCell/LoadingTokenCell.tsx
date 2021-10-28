import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
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
