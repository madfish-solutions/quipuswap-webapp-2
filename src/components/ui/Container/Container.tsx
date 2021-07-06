import React from 'react';
import cx from 'classnames';

import s from './Container.module.sass';

type ContainerProps = {
  className?: string
  theme?: keyof typeof themeClass
};

const themeClass = {
  default: s.default,
  fluid: s.fluid,
};

export const Container: React.FC<ContainerProps> = ({
  theme = 'default',
  children,
  className,
}) => (
  <div className={cx(s.root, themeClass[theme], className)}>
    {children}
  </div>
);
