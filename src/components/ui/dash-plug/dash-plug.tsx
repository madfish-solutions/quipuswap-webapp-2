import { FC, useContext, useLayoutEffect, useMemo, useRef } from 'react';

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

  const container = useRef<HTMLDivElement>(null);

  const wrapperClassName = cx(
    s['inline-loading'],
    {
      [s.animation]: animation !== false
    },
    modeClass[colorThemeMode],
    className
  );

  useLayoutEffect(() => {
    container.current?.style.setProperty('--zoom', `${zoom ?? 1}`);
  }, [zoom]);

  const iterator = useMemo(() => {
    return new Array(DASH_QUANTITY).fill(null).map((_, index) => index);
  }, []);

  return (
    <div ref={container} className={wrapperClassName}>
      {iterator.map(key => (
        <div className={s.dash} key={key} />
      ))}
    </div>
  );
};
