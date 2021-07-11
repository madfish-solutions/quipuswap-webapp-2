import React, {
  useContext,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Button } from '@components/ui/Button';
import s from './NavLink.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type NavLinkProps = {
  className?: string
  href: string
  label: React.ReactNode
  Icon: React.FC<IconProps>
  active: boolean
};

export const NavLink: React.FC<NavLinkProps> = ({
  className,
  active,
  label,
  Icon,
  href,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={className}>
      <Button
        theme="clean"
        href={href}
        className={cx(s.root, { [s.active]: active }, modeClass[colorThemeMode])}
      >
        <Icon {...{ active }} />
        <span className={s.text}>{label}</span>
      </Button>
    </div>
  );
};
