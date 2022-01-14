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
  dashQuantity?: number;
}
const DEFAULT_DASH_QUANTITY = 4;
const MAX_DASH_QUANTITY = 8;

export const DashPlug: FC<DashPlugProps> = ({ zoom, animation, dashQuantity }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const wrapperClassName = cx(
    s['inline-loading'],
    {
      [s.animation]: animation !== false
    },
    modeClass[colorThemeMode]
  );

  const iterator = useMemo(() => {
    const quantity = Math.min(dashQuantity ?? DEFAULT_DASH_QUANTITY, MAX_DASH_QUANTITY);

    return new Array(quantity).fill(null).map((_, index) => index);
  }, [dashQuantity]);

  return (
    <div className={wrapperClassName} style={{ transform: `scale(${zoom})` }}>
      {iterator.map(key => (
        <div className={s.dash} key={key} />
      ))}
    </div>
  );
};
