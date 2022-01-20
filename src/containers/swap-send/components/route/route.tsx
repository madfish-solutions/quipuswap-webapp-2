import React, { Fragment, useContext } from 'react';

import { Button, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { isLastElementIndex } from '@utils/helpers';

import s from './route.module.sass';

interface RouteType {
  id: number;
  name: string;
  link: string;
}

interface Props {
  routes: RouteType[];
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Route: React.FC<Props> = ({ routes, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      {routes.map((route, index) => (
        <Fragment key={route.id}>
          <Button external href={route.link} className={s.route} theme="quaternary">
            {route.name}
          </Button>
          {!isLastElementIndex(index, routes) && <span className={s.divider}>&gt;</span>}
        </Fragment>
      ))}
    </div>
  );
};
