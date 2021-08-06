import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Skeleton } from '@components/ui/Skeleton';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LoadingBakerCell: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.loading,
    s.listItem,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.bakerFlexCell}>
        <Skeleton className={s.loadingLogo} />
        <Skeleton className={s.loadingName} />
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.loadingBakerBlock}>
          <div className={s.caption}>
            <Skeleton className={s.loadingCaption} />
          </div>
          <div className={s.caption}>
            <Skeleton className={s.loadingCaption} />
          </div>
        </div>
        <div className={s.loadingBakerBlock}>
          <div className={s.caption}>
            <Skeleton className={s.loadingCaption} />
          </div>
          <div className={s.caption}>
            <Skeleton className={s.loadingCaption} />
          </div>
        </div>
      </div>
    </div>

  );
};
