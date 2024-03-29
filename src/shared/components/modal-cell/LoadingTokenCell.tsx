import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import s from './ModalCell.module.scss';
import { Skeleton } from '../skeleton';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const LoadingTokenCell: FC = () => {
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
