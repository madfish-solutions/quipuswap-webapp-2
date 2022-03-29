import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { isUndefined } from '@shared/helpers/type-checks';

import { DataTestAttribute } from '../../../tests/types';
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
} & (React.HTMLProps<HTMLButtonElement> | React.HTMLProps<HTMLAnchorElement>) &
  // eslint-disable-next-line @typescript-eslint/no-type-alias
  DataTestAttribute;

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
  testId,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(className, s.root, modeClass[colorThemeMode], themeClass[theme], {
    [s.loading]: loading
  });

  const content = (
    <ButtonContent theme={theme} innerClassName={innerClassName} textClassName={textClassName} loading={loading}>
      {children}
    </ButtonContent>
  );

  if ('href' in props && !isUndefined(props.href)) {
    const anchorProps = {
      target: external ? '_blank' : undefined,
      rel: external ? 'noreferrer noopener' : undefined,
      className: compoundClassName,
      ...(props as React.HTMLProps<HTMLAnchorElement>)
    };

    return (
      <a data-test-id={testId} {...anchorProps}>
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
      data-test-id={testId}
      {...(props as React.HTMLProps<HTMLButtonElement>)}
    >
      {control}
      {content}
      {icon}
    </button>
  );
};
