import { FC, ForwardRefExoticComponent, HTMLProps, ReactNode, RefAttributes, useContext } from 'react';

import cx from 'classnames';
import { Link, LinkProps } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { isUndefined } from '@shared/helpers/type-checks';

import { ButtonContent } from './button-content';
import styles from './button.module.scss';

export type ButtonProps = {
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  theme?: keyof typeof themeClass;
  external?: boolean;
  themeOposite?: boolean;
  className?: string;
  innerClassName?: string;
  textClassName?: string;
  icon?: ReactNode;
  control?: ReactNode;
} & (HTMLProps<HTMLButtonElement> | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>);

const themeClass = {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
  quaternary: styles.quaternary,
  inverse: styles.inverse,
  underlined: styles.underlined,
  clean: styles.clean
};

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Button: FC<ButtonProps> = ({
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

  const compoundClassName = cx(className, styles.root, modeClass[colorThemeMode], themeClass[theme], {
    [styles.loading]: loading
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
      ...(props as ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> & { href: string })
    };

    if (anchorProps.target === '_blank') {
      return (
        <a {...anchorProps}>
          {control}
          {content}
          {icon}
        </a>
      );
    } else {
      return (
        <Link to={anchorProps.href} {...anchorProps}>
          {control}
          {content}
          {icon}
        </Link>
      );
    }
  }

  return (
    <button
      // @ts-ignore
      type={type}
      className={compoundClassName}
      {...(props as HTMLProps<HTMLButtonElement>)}
    >
      {control}
      {content}
      {icon}
    </button>
  );
};
