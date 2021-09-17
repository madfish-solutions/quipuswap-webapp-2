import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Bage } from '@components/ui/Bage';

import s from './NewsCard.module.sass';

type NewsCardProps = {
  id: number,
  sponsored?: boolean
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const NewsCard: React.FC<NewsCardProps> = ({
  sponsored = false,
  id,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, className, modeClass[colorThemeMode])}>
      {sponsored && <Bage text="sponsored" />}
      {id}
    </div>
  );
};
