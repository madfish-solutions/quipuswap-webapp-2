/* eslint-disable react/button-has-type */
import React, { useContext } from 'react';
import Link, { LinkProps } from 'next/link';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Button.module.sass';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  theme?: keyof typeof themeClass
  external?: boolean
  className?: string
} & (
  | React.HTMLProps<HTMLButtonElement>
  | LinkProps
  | React.HTMLProps<HTMLAnchorElement>
);

const themeClass = {
  primary: s.primary,
  secondary: s.secondary,
  tertiary: s.tertiary,
  quaternary: s.quaternary,
  inverse: s.inverse,
  underlined: s.underlined,
  clean: s.clean,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  theme = 'primary',
  external = false,
  className,
  children,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    themeClass[theme],
    className,
  );

  const content = theme === 'secondary' ? (
    <span className={s.inner}>
      <span className={s.text}>
        {children}
      </span>
    </span>
  ) : children;

  if ('href' in props) {
    if (external) {
      return (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className={compoundClassName}
          {...(props as React.HTMLProps<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link {...(props as LinkProps)}>
        <a className={compoundClassName}>{content}</a>
      </Link>
    );
  }

  return (
    <button
      // @ts-ignore
      type={type}
      {...(props as React.HTMLProps<HTMLButtonElement>)}
      className={compoundClassName}
    >
      {content}
    </button>
  );
};
