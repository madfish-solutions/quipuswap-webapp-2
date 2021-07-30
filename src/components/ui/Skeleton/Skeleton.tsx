import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Skeleton.module.sass';

export enum SkeletonModes {
  Text = 'text',
  LongText = 'longText',
  Logo = 'logo',
  Bage = 'bage',
}

type SkeletonProps = {
  className?: string
  type: SkeletonModes
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const modeClass = {
  [SkeletonModes.Text]: s.text,
  [SkeletonModes.LongText]: s.LongText,
  [SkeletonModes.Logo]: s.logo,
  [SkeletonModes.Bage]: s.bage,
};

export const Skeleton: React.FC<SkeletonProps> = ({ className, type }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(themeClass[colorThemeMode], modeClass[type], s.skeleton, className);

  return (
    <div className={compoundClassName} />
  );
};
