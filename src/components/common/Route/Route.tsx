import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';

import s from './Route.module.sass';

type RouteType = {
  id: number,
  name: string,
  link: string
};

type RouteProps = {
  routes: RouteType[]
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Route: React.FC<RouteProps> = ({
  routes,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {routes.map((route, index) => (
        <React.Fragment key={route.id}>
          <Button external href={route.link} className={s.route} theme="quaternary">
            {route.name}
          </Button>
          {index !== routes.length - 1 && (
            <span className={s.divider}>
              &gt;
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
