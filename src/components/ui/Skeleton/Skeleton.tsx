import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Skeleton.module.sass';

type SkeletonProps = {
  className?: string
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    themeClass[colorThemeMode],
    className,
  );

  return (
    <div className={compoundClassName} />
  );
};
