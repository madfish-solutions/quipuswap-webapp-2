import React from 'react';
import cx from 'classnames';

import { Logo } from '@components/svg/Logo';

import s from './Preloader.module.sass';

export const Preloader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => (
  <div className={cx(s.root, className)} {...rest}>
    <Logo className={s.icon} />
  </div>
);
