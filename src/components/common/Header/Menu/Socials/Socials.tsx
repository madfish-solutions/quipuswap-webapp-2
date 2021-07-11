import React from 'react';
import cx from 'classnames';

import { ColorModes } from '@providers/ColorThemeContext';

import { Button } from '@components/ui/Button';
import s from './Socials.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type SocialsProps = {
  className?: string
  socialLinks: Array<{
    id: number
    href: string
    label: string
    Icon: React.FC<IconProps>
  }>
  theme?: keyof typeof modeClass
};

export const Socials: React.FC<SocialsProps> = ({
  socialLinks,
  className,
}) => (
  <div className={cx(s.root, className)}>
    {socialLinks.map(({
      id, href, label, Icon,
    }) => (
      <Button
        key={id}
        theme="quaternary"
        href={href}
        title={label}
        className={s.socialLink}
      >
        <Icon />
      </Button>
    ))}
  </div>
);
