import React from 'react';
import cx from 'classnames';

import { Button } from '@components/ui/Button';

import { SocialLinksData } from './content';
import s from './Socials.module.sass';

type SocialsProps = {
  className?: string
};

export const Socials: React.FC<SocialsProps> = ({
  className,
}) => (
  <div className={cx(s.root, className)}>
    {SocialLinksData.map(({
      id, href, label, Icon,
    }) => (
      <Button
        key={id}
        theme="quaternary"
        href={href}
        external
        title={label}
        className={s.socialLink}
      >
        <Icon />
      </Button>
    ))}
  </div>
);
