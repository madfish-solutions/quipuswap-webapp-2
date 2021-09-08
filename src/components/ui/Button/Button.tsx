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
  innerClassName?: string
  textClassName?: string
  icon?:React.ReactNode
  control?:React.ReactNode
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
  colored: s.colored,
  clean: s.clean,
  radio: s.radio,
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
  innerClassName,
  textClassName,
  children,
  icon,
  control,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    themeClass[theme],
    className,
  );

  let content = theme === 'primary'
    ? children
    : (
      <span className={cx(s.text, textClassName)}>
        {children}
      </span>
    );

  if (theme === 'secondary') {
    content = (
      <span className={cx(s.inner, innerClassName)}>
        <span className={cx(s.text, textClassName)}>
          {children}
        </span>
      </span>
    );
  }

  if ('href' in props) {
    if (external) {
      return (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className={compoundClassName}
          {...(props as React.HTMLProps<HTMLAnchorElement>)}
        >
          {control}
          {content}
          {icon}
        </a>
      );
    }
    return (
      <Link {...(props as LinkProps)}>
        <a
          className={compoundClassName}
          title={(props as React.HTMLProps<HTMLAnchorElement>).title}
        >
          {control}
          {content}
          {icon}
        </a>
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
      {control}
      {content}
      {icon}
    </button>
  );
};
