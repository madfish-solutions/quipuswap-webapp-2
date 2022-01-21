import React from 'react';

import cx from 'classnames';

import { LogoSmallMonochrome } from '@components/svg/logo-small-monochrome';

import { ButtonProps } from './button';
import s from './button.module.sass';

type ButtonContentProps = Pick<ButtonProps, 'theme' | 'innerClassName' | 'textClassName' | 'loading'>;

export const ButtonContent: React.FC<ButtonContentProps> = ({
  children,
  theme,
  innerClassName,
  textClassName,
  loading
}) => {
  if (loading) {
    return theme === 'secondary' ? (
      <span className={cx(s.inner, innerClassName)}>
        <LogoSmallMonochrome className={s.loadingIcon} />
      </span>
    ) : (
      <LogoSmallMonochrome className={s.loadingIcon} />
    );
  }

  switch (theme) {
    case 'primary':
      return <>{children}</>;
    case 'secondary':
      return (
        <span className={cx(s.inner, innerClassName)}>
          <span className={cx(s.text, textClassName)}>{children}</span>
        </span>
      );
    default:
      return <span className={cx(s.text, textClassName)}>{children}</span>;
  }
};
