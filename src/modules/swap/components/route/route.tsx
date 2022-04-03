import React, { Fragment, useContext } from 'react';

import cx from 'classnames';

import { HIDE_ANALYTICS } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { isLastElementIndex } from '@shared/helpers';

import s from './route.module.scss';

interface RouteType {
  id: number;
  name: string;
  link: string;
}

export interface RouteProps {
  routes: RouteType[];
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Route: React.FC<RouteProps> = ({ routes, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {routes.map((route, index) => (
        <Fragment key={route.id}>
          {HIDE_ANALYTICS ? (
            <span className={s.route}> {route.name}</span>
          ) : (
            <Button external href={route.link} className={s.route} theme="quaternary">
              {route.name}
            </Button>
          )}
          {!isLastElementIndex(index, routes) && <span className={s.divider}>&gt;</span>}
        </Fragment>
      ))}
    </div>
  );
};
