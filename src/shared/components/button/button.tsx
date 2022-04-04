import { FC, ForwardRefExoticComponent, HTMLProps, ReactNode, RefAttributes, useContext } from 'react';

import cx from 'classnames';
import { Link, LinkProps } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { isUndefined } from '@shared/helpers/type-checks';

import { DataTestAttribute } from '../../../tests/types';
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
} & (HTMLProps<HTMLButtonElement> | ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>) &
  // eslint-disable-next-line @typescript-eslint/no-type-alias
  DataTestAttribute;

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
  testId,
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
    // eslint-disable-next-line no-console
    console.log('external: ', external);
    const anchorProps = {
      target: external ? '_blank' : undefined,
      rel: external ? 'noreferrer noopener' : undefined,
      className: compoundClassName,
      ...(props as ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> & { href: string })
    };
    // eslint-disable-next-line no-console
    console.log(anchorProps);
    if (anchorProps.target === '_blank') {
      return (
        <a data-test-id={testId} {...anchorProps}>
          {control}
          {content}
          {icon}
        </a>
      );
    } else {
      return (
        <Link data-test-id={testId} to={anchorProps.href} {...anchorProps}>
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
      data-test-id={testId}
      {...(props as HTMLProps<HTMLButtonElement>)}
    >
      {control}
      {content}
      {icon}
    </button>
  );
};
