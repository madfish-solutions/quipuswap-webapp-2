import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { ButtonContent } from './button-content';
import s from './button.module.sass';

export type ButtonProps = {
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  theme?: keyof typeof themeClass;
  external?: boolean;
  themeOposite?: boolean;
  className?: string;
  innerClassName?: string;
  textClassName?: string;
  icon?: React.ReactNode;
  control?: React.ReactNode;
} & (React.HTMLProps<HTMLButtonElement> | React.HTMLProps<HTMLAnchorElement>);

const themeClass = {
  primary: s.primary,
  secondary: s.secondary,
  tertiary: s.tertiary,
  quaternary: s.quaternary,
  inverse: s.inverse,
  underlined: s.underlined,
  clean: s.clean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const getOpositeColorTheme = (modeClass: Record<ColorModes, string>, colorThemeMode: ColorModes) => {
  const colorMode = colorThemeMode === ColorModes.Light ? ColorModes.Dark : ColorModes.Light;

  return modeClass[colorMode];
};

export const Button: React.FC<ButtonProps> = ({
  loading,
  type = 'button',
  theme = 'primary',
  external = false,
  className,
  innerClassName,
  textClassName,
  children,
  icon,
  control,
  themeOposite,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const colorTheme = !themeOposite ? modeClass[colorThemeMode] : getOpositeColorTheme(modeClass, colorThemeMode);

  const compoundClassName = cx(className, s.root, colorTheme, themeClass[theme], {
    [s.loading]: loading
  });

  const content = (
    <ButtonContent theme={theme} innerClassName={innerClassName} textClassName={textClassName} loading={loading}>
      {children}
    </ButtonContent>
  );

  if ('href' in props) {
    const anchorProps = {
      target: external ? '_blank' : undefined,
      rel: external ? 'noreferrer noopener' : undefined,
      className: compoundClassName,
      ...(props as React.HTMLProps<HTMLAnchorElement>)
    };

    return (
      <a {...anchorProps}>
        {control}
        {content}
        {icon}
      </a>
    );
  }

  return (
    <button
      // @ts-ignore
      type={type}
      className={compoundClassName}
      {...(props as React.HTMLProps<HTMLButtonElement>)}
    >
      {control}
      {content}
      {icon}
    </button>
  );
};
