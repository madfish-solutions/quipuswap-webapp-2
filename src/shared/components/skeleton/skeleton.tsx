import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import s from './skeleton.module.scss';

interface ClassNameProps {
  className: string;
}

interface SizesProps {
  className?: string;
  width: number;
  height: number;
}

type Props = ClassNameProps | SizesProps;

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Skeleton: FC<Props> = ({ className, ...other }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.root, themeClass[colorThemeMode], className);

  const style = 'width' in other ? { width: other.width, height: other.height } : {};

  return <div className={compoundClassName} style={style} />;
};
