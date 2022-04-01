import { FC, useContext, useLayoutEffect, useMemo, useRef } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './dash-plug.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export interface DashPlugProps {
  zoom?: number;
  animation?: boolean;
  className?: string;
  quantity?: number;
}
const DASH_QUANTITY = 4;
const DEFAULT_ZOOM = 1;

export const DashPlug: FC<DashPlugProps> = ({ zoom, animation, className, quantity }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const container = useRef<HTMLDivElement>(null);

  const wrapperClassName = cx(
    styles['inline-loading'],
    {
      [styles.animation]: animation !== false
    },
    modeClass[colorThemeMode],
    className
  );

  useLayoutEffect(() => {
    container.current?.style.setProperty('--zoom', `${zoom ?? DEFAULT_ZOOM}`);
  }, [zoom]);

  const iterator = useMemo(() => {
    return new Array(quantity ?? DASH_QUANTITY).fill(null).map((_, index) => index);
  }, [quantity]);

  return (
    <div ref={container} className={wrapperClassName}>
      {iterator.map(key => (
        <div className={styles.dash} key={key} />
      ))}
    </div>
  );
};
