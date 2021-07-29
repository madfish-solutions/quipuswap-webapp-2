import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Skeleton.module.sass';

type SkeletonProps = {
  className?: string
  type: 'text' | 'longText' | 'logo' | 'bage'
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Skeleton: React.FC<SkeletonProps> = ({ className, type }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx({
    [modeClass[colorThemeMode]]: true,
    [s.skeleton]: true,
    [className!!]: true,
    [s.loadingSymbol]: type === 'text',
    [s.loadingName]: type === 'longText',
    [s.loadingLogos]: type === 'logo',
    [s.loadingBage]: type === 'bage',
  });

  return (
    <div className={compoundClassName} />
  );
};
