import React, { useContext } from 'react';
import cx from 'classnames';
import { Skeleton } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Loader.module.sass';

type LoaderProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Loader: React.FC<LoaderProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    className,
  );

  return (
    <Skeleton className={compoundClassName} />
  );
};
