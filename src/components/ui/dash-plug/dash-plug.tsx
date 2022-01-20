import { FC, useContext, useMemo } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './dash-plug.module.scss';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface DashPlugProps {
  zoom?: number;
  animation?: boolean;
  className?: string;
}
const DASH_QUANTITY = 4;

export const DashPlug: FC<DashPlugProps> = ({ zoom, animation, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapperClassName = cx(
    s['inline-loading'],
    {
      [s.animation]: animation !== false
    },
    modeClass[colorThemeMode],
    className
  );

  const iterator = useMemo(() => {
    return new Array(DASH_QUANTITY).fill(null).map((_, index) => index);
  }, []);

  return (
    <div className={wrapperClassName} style={{ transform: `scale(${zoom})` }}>
      {iterator.map(key => (
        <div className={s.dash} key={key} />
      ))}
    </div>
  );
};
